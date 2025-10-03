import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Função para obter o carimbo de data/hora UTC atual
function getCurrentUTCTimestamp() {
  return new Date().toISOString();
}

// Função para obter o carimbo de data/hora UTC daqui a 3 dias
function getNextDayUTCTimestamp() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  return tomorrow.toISOString();
}

// Função para obter previsão do tempo
async function getHourlyWeatherForecast() {
  // API stormglass.io:
  const latitude = -23.17; // Sua latitude
  const longitude = -50.64; // Sua longitude
  /*
  const chave =
    "d34d27ce-10dd-11ef-b4e2-0242ac130002-d34d2878-10dd-11ef-b4e2-0242ac130002"; // Sua chave da API
  const params1 =
    "airTemperature,pressure,cloudCover,windSpeed,humidity,precipitation,dewPointTemperature"; // parametros para puxar da URL1
  const apiUrl1 = `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${params1}&start=${getCurrentUTCTimestamp()}&end=${getNextDayUTCTimestamp()}`;
  const params2 = "uvIndex";
  const apiUrl2 = `https://api.stormglass.io/v2/solar/point?lat=${latitude}&lng=${longitude}&params=${params2}&start=${getCurrentUTCTimestamp()}&end=${getNextDayUTCTimestamp()}`;
  */

  // API tomorrow.io:
  const chave2 = "NZITIeTKsgwcv6YJnw2igggnrmAGujug";
  const apiUrl3 = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude}%2C%20${longitude}&timesteps=1h%2C1d&units=metric&apikey=${chave2}`;

  // valores a serem resgatados da API
  let times: string[] = [];
  let temperatures: number[] = [];
  let feelsLike: number[] = [];
  let pressures: number[] = [];
  let cloudCovers: number[] = [];
  let windSpeeds: number[] = [];
  let rajadas: number[] = [];
  let humidities: number[] = [];
  let precipitations: number[] = [];
  let precipitationProbabilitiesDaily: number[] = [];
  let precipitationProbabilitiesHourly: number[] = [];
  let dewPointTemperatures: number[] = [];
  let uvIndex: number[] = [];
  let sunrise: string = "-";
  let sunset: string = "-";
  let dates: string[] = [];
  let tempChartData: { time: string; temperature: number }[] = [];
  let rainChartData: {
    time: string;
    precipitation: string;
    precipitationProbability: string;
  }[] = [];
  let next30ChartData: {
    timestamp: string;
    date: string;
    temperatureMax: string;
    temperatureMin: string;
    cloudCover: number;
  }[] = [];

  // chamada da terceira URL
  let response = await fetch(apiUrl3);
  let data = await response.json();

  sunrise = new Date(
    data.timelines.daily[0].values.sunriseTime
  ).toLocaleTimeString([], { hour: "numeric", minute: "numeric" });

  sunset = new Date(
    data.timelines.daily[0].values.sunsetTime
  ).toLocaleTimeString([], { hour: "numeric", minute: "numeric" });

  let date;
  let timeString;
  let dateString;
  data.timelines.hourly.map((h: any) => {
    date = new Date(h.time);

    timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    times.push(timeString);

    dateString = date.toLocaleDateString([], {
      day: "numeric",
      month: "numeric",
    });
    dates.push(dateString);

    temperatures.push(Math.round(h.values.temperature));
    feelsLike.push(Math.round(h.values.temperatureApparent));
    pressures.push(h.values.pressureSeaLevel);
    cloudCovers.push(h.values.cloudCover);
    windSpeeds.push(h.values.windSpeed);
    rajadas.push(h.values.windGust);
    humidities.push(h.values.humidity);
    precipitations.push(h.values.rainAccumulation);
    precipitationProbabilitiesHourly.push(h.values.precipitationProbability);
    dewPointTemperatures.push(h.values.dewPoint);
    tempChartData.push({
      time: timeString,
      temperature: Math.round(h.values.temperature),
    });
    rainChartData.push({
      time: timeString,
      precipitation: h.values.rainAccumulation,
      precipitationProbability: h.values.precipitationProbability,
    });
    uvIndex.push(h.values.uvIndex || 0);
  });

  data.timelines.daily.map((d: any) => {
    precipitationProbabilitiesDaily.push(d.values.precipitationProbabilityAvg);
    next30ChartData.push({
      timestamp: d.time,
      date: new Date(d.time).toLocaleDateString([], {
        day: "numeric",
        month: "numeric",
      }),
      temperatureMax: Math.round(d.values.temperatureMax).toString(),
      temperatureMin: Math.round(d.values.temperatureMin).toString(),
      cloudCover: d.values.cloudCoverAvg,
    });
  });

  const lastDataFetchHour = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
  });

  data = {
    lastDataFetchHour,
    times,
    temperatures,
    feelsLike,
    pressures,
    cloudCovers,
    windSpeeds,
    rajadas,
    humidities,
    precipitations,
    precipitationProbabilitiesDaily,
    precipitationProbabilitiesHourly,
    dewPointTemperatures,
    uvIndex,
    sunrise,
    sunset,
    dates,
    tempChartData,
    rainChartData,
    next30ChartData,
  };

  return data;
}

export async function POST() {
  try {
    const data = await getHourlyWeatherForecast();

    const filePath = path.join(process.cwd(), "data", "dados.json");

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    console.error("ERRO NA ROTA /api/update-json:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar dados" },
      { status: 500 }
    );
  }
}
