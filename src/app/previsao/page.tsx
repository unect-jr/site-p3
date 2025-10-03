"use client"; 

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChartConfig } from "@/components/ui/chart";
import ClimateChart from "../components/climate-chart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PrecipitationChart from "../components/precipitation-chart";
import Next30Chart from "../components/next30-chart";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface WeatherData {
  times: string[];
  temperatures: number[];
  feelsLike: number[];
  pressures: number[];
  cloudCovers: number[];
  windSpeeds: number[];
  rajadas: number[];
  humidities: number[];
  precipitations: number[];
  precipitationProbabilitiesDaily: number[];
  precipitationProbabilitiesHourly: number[];
  dewPointTemperatures: number[];
  uvIndex: number[];
  sunrise: string;
  sunset: string;
  dates: string[];
  tempChartData: { time: string; temperature: string }[];
  rainChartData: {
    time: string;
    precipitation: string;
    precipitationProbability: string;
  }[];
  next30ChartData: {
    timestamp: string;
    date: string;
    temperatureMax: string;
    temperatureMin: string;
    cloudCover: number;
  }[];
}

export default function Previsao() {
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState("Carregando...");
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationCoords({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setGeoError("Geolocalização negada. Por favor, habilite a localização no seu navegador para ver a previsão.");
        }
      );
    } else {
      setGeoError("Geolocalização não suportada por este navegador.");
    }
  }, []);

  const { data: weatherData, isLoading, isError } = useQuery({
    queryKey: ["weather", locationCoords],
    queryFn: async () => {
      if (!locationCoords) return null;
      const { latitude, longitude } = locationCoords;
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const locationResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
      );
      const locationData = await locationResponse.json();
      setLocationName(
        `${locationData.city}, ${locationData.principalSubdivisionCode.split("-")[1]}`
      );

      return data;
    },
    enabled: !!locationCoords,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // funcao que escolhe qual imagem usar para cada tempo
  function chooseCloudImage(cover: number, probability: number) {
    if (cover < 50) {
      return "/sol.svg";
    } else if (probability < 60) {
      return "/nublado.svg";
    } else {
      return "/tempestade.svg";
    }
  }

  // associa o tempo ao texto correspondente
  function chooseCloudText(cover: number, probability: number) {
    if (cover < 50) {
      return "Ensolarado";
    } else if (probability < 50) {
      return "Nublado";
    } else {
      return "Chuva";
    }
  }

  // funçao para pegar o titulo inteiro da ultima parte da previsao
  function getFullTittle() {
    if (!weatherData) return "";
    const d = new Date(weatherData.next30ChartData[0].timestamp);
    const title = `${weekDays[d.getDay()]}: ${d.getDate()} de ${months[d.getMonth()]
      }, ${d.getFullYear()}`;

    return title;
  }

  // dias da semana em texto
  const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  // meses em texto
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // temperature chart configs
  const tempChartConfig = {
    temperature: {
      label: "Temperatura",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // rain chart configs
  const rainChartConfig = {
    precipitation: {
      label: "Precipitação",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  // grafico dos proximos 30 dias configs
  const next30ChartConfig = {
    temperatureMax: {
      label: "Max",
      color: "var(--chart-6)",
    },
    temperatureMin: {
      label: "Min",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl">Carregando previsão do tempo...</h1>
      </div>
    );
  }

  if (isError || geoError) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-4xl">Ops! Algo deu errado.</h1>
          <p className="text-xl mt-2 text-gray-600">{geoError || "Não foi possível buscar os dados da previsão. Tente novamente mais tarde."}</p>
        </div>
      </div>
    );
  }

  if (!weatherData || !locationCoords) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl">Não foi possível carregar a previsão do tempo.</h1>
      </div>
    );
  }

  const currentWeather = weatherData.temperatures?.[0];
  const currentFeelsLike = weatherData.feelsLike?.[0];
  const currentCloudCover = weatherData.cloudCovers?.[0];
  const currentPrecipitationProbability = weatherData.precipitationProbabilitiesHourly?.[0];
  const currentMaxTemp = weatherData.next30ChartData?.[0]?.temperatureMax;
  const currentMinTemp = weatherData.next30ChartData?.[0]?.temperatureMin;
  const currentSunrise = weatherData.sunrise;
  const currentSunset = weatherData.sunset;
  const currentHumidity = weatherData.humidities?.[0];
  const currentPrecipitation = weatherData.precipitations?.[0];
  const currentWindGust = weatherData.rajadas?.[0];
  const currentDewPoint = weatherData.dewPointTemperatures?.[0];
  const currentPressure = weatherData.pressures?.[0];
  const currentWindSpeed = weatherData.windSpeeds?.[0];
  const currentUvIndex = weatherData.uvIndex?.[0];


  return (
    <>
      {/* BANNER */}
      <div className="w-full relative">
        <div className="flex flex-col items-center py-30 md:py-50 relative z-10">
          <h1 className="text-white font-nebula text-4xl md:text-7xl text-center leading-tight">
            Previsão do tempo
          </h1>
        </div>
        <Image
                  src="/Home_background.png"
                  alt="banner bg"
                  fill
                  className="object-cover z-[-1] max-h-[520px] md:max-h-[800px]"
                />
      </div>

      {/* CLIMA GERAL */}
      <div className="w-full bg-p3green-secondary p-28">
        <div className="rounded-xl bg-white py-30 px-12 font-poppins">
          {/* PRIMEIRA PARTE */}
          <div className="flex flex-col items-center gap-10">
            <h1 className="text-4xl font-medium">Tempo real: {locationName}</h1>
            <div className="flex flex-row gap-10 items-center">
              <h1 className="text-7xl font-medium">
                {currentWeather ?? "0"} °C
              </h1>
              <Image
                src={chooseCloudImage(
                  currentCloudCover ?? 0,
                  currentPrecipitationProbability ?? 0
                )}
                alt="teste"
                width={70}
                height={80}
                priority
              />
              <h2 className="text-xl font-medium">
                {chooseCloudText(
                  currentCloudCover ?? 0,
                  currentPrecipitationProbability ?? 0
                )}
              </h2>
            </div>
            <div className="flex flex-row gap-6 items-center justify-center">
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3">
                <h2 className="text-2xl">
                  Sensação:{" "}
                  <span className="font-semibold">
                    {currentFeelsLike ?? "0"} °C
                  </span>
                </h2>
              </div>
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3 gap-1">
                <Image
                  src="/max-temp.png"
                  alt="teste"
                  width={28}
                  height={28}
                  priority
                />
                <h2 className="text-2xl">
                  Máx:{" "}
                  <span className="font-semibold">
                    {currentMaxTemp ?? "0"} °C
                  </span>
                </h2>
              </div>
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3 gap-1">
                <Image
                  src="/min-temp.png"
                  alt="teste"
                  width={28}
                  height={28}
                  priority
                />
                <h2 className="text-2xl">
                  Mín:{" "}
                  <span className="font-semibold">
                    {currentMinTemp ?? "0"} °C
                  </span>
                </h2>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-center justify-center">
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3 gap-3">
                <h2 className="text-2xl">
                  {currentSunrise ?? "-"}
                </h2>
                <Image
                  src="/sunrise.png"
                  alt="teste"
                  width={30}
                  height={30}
                  priority
                />
                <h2 className="text-2xl">Nascente</h2>
              </div>
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3 gap-3">
                <h2 className="text-2xl">
                  {currentSunset ?? "-"}
                </h2>
                <Image
                  src="/sunset.png"
                  alt="teste"
                  width={34}
                  height={30}
                  priority
                />
                <h2 className="text-2xl">Poente</h2>
              </div>
            </div>
          </div>

          {/* MAIS DETALHES E MAPA */}
          <div className="flex flex-row justify-center gap-5 pt-22">
            <div className="flex flex-col gap-4 grow">
              <div className="bg-gray-300 flex items-center justify-center rounded-lg px-5 py-3">
                <h2 className="text-2xl">
                  Possibilidade Chuva:{" "}
                  <span className="text-blue-600">
                    {currentPrecipitationProbability ?? "0"}%
                  </span>{" "}
                  · Umidade:{" "}
                  <span className="text-blue-600">
                    {currentHumidity ?? "0"}%
                  </span>{" "}
                  · Precipitação:{" "}
                  <span className="text-blue-600">
                    {currentPrecipitation ?? "0"} mm
                  </span>
                </h2>
              </div>
              <div className="text-2xl bg-amber-100 flex flex-col items-center justify-center rounded-lg px-10 h-full gap-4">
                <div className="flex flex-row justify-between w-full">
                  <h2>
                    Rajadas:{" "}
                    <span className="font-semibold">
                      {currentWindGust ?? "0"} km/h
                    </span>
                  </h2>
                  <h2>
                    Ponto Orvalho:{" "}
                    <span className="font-semibold">
                      {currentDewPoint ?? "0"} °C
                    </span>
                  </h2>
                </div>
                <Separator className="bg-white py-0.5" />
                <div className="flex flex-row justify-between w-full">
                  <h2>
                    Cobertura Nuvens:{" "}
                    <span className="font-semibold">
                      {currentCloudCover ?? "0"}%
                    </span>
                  </h2>
                  <h2>
                    Pressão:{" "}
                    <span className="font-semibold">
                      {currentPressure ?? "0"} hPa
                    </span>
                  </h2>
                </div>
                <Separator className="bg-white py-0.5" />
                <div className="flex flex-row justify-between w-full">
                  <h2>
                    Vento:{" "}
                    <span className="font-semibold">
                      {currentWindSpeed ?? "0"} km/h
                    </span>
                  </h2>
                  <h2>
                    índice UV:{" "}
                    <span className="font-semibold">
                      {currentUvIndex ?? "0"}
                    </span>
                  </h2>
                </div>
                <Separator className="bg-white py-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg w-[450px] h-[350px]">
              <iframe
                src={`https://maps.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}&hl=es;z=14&output=embed`}
                loading="lazy"
                className="rounded-lg w-full h-full"
              ></iframe>
            </div>
          </div>

          <Separator className="bg-gray-200 rounded-full my-14 py-[2px]" />

          {/* GRAFICO DO TEMPO DE HORA EM HORA */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-semibold pb-2">
              Temperatura - Hora em hora
            </h1>
            <ScrollArea>
              <div className="flex flex-row justify-between text-sm mb-[-10px]">
                {weatherData.dates &&
                  weatherData.dates.map((d: string, i: number) => {
                    return (
                      <div key={i} className="px-3">
                        {d}
                      </div>
                    );
                  })}
              </div>
              <ClimateChart
                chartConfig={tempChartConfig}
                chartData={weatherData.tempChartData}
              />
              <div className="flex flex-row justify-between px-4 pb-5 pt-2">
                {weatherData.times &&
                  weatherData.times.map((t: string, i: number) => {
                    return (
                      <Image
                        src={chooseCloudImage(
                          weatherData.cloudCovers[i],
                          weatherData.precipitationProbabilitiesHourly[i]
                        )}
                        alt="teste"
                        width={28}
                        height={20}
                        priority
                        key={i}
                      />
                    );
                  })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <Separator className="bg-gray-200 rounded-full my-14 py-[2px]" />

          {/* PRECIPITAÇÃO HORA EM HORA */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-semibold pb-2">
              Precipitação - Hora em Hora
            </h1>
            <ScrollArea>
              <PrecipitationChart
                chartConfig={rainChartConfig}
                chartData={weatherData.rainChartData}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <Separator className="bg-gray-200 rounded-full my-14 py-[2px]" />

          {/* 5 DIAS */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-semibold pb-2">Próximos 5 Dias</h1>
            <ScrollArea>
              <div className="flex flex-row justify-between text-sm px-1">
                {weatherData.next30ChartData &&
                  weatherData.next30ChartData.map((d: { date: string }, i: number) => {
                    return (
                      <div key={i} className="px-3">
                        {d.date}
                      </div>
                    );
                  })}
              </div>
              <Next30Chart
                chartConfig={next30ChartConfig}
                chartData={weatherData.next30ChartData}
              />
              <div className="flex flex-row justify-between py-5">
                {weatherData.next30ChartData &&
                  weatherData.next30ChartData.map((d: { cloudCover: number; timestamp: string }, i: number) => {
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center gap-3"
                      >
                        <Image
                          src={chooseCloudImage(
                            d.cloudCover,
                            weatherData.precipitationProbabilitiesDaily[i]
                          )}
                          alt="teste"
                          width={36}
                          height={20}
                          priority
                        />
                        <div
                          className={`min-w-[70px] border-p3orange border-2 text-center px-2 py-1 rounded-sm font-light text-xl ${i === 0
                            ? "bg-white text-p3orange "
                            : "bg-p3orange text-white"
                            }`}
                        >
                          {i == 0
                            ? "HOJE"
                            : weekDays[new Date(d.timestamp).getDay()]
                              .toUpperCase()
                              .slice(0, 3)}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <Separator className="bg-gray-200 rounded-full my-14 py-[2px]" />

          {/* ULTIMA PREVISAO */}
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl font-semibold">{getFullTittle()}</h1>
            <div className="flex flex-row items-center gap-8 px-4">
              <Image
                src={chooseCloudImage(
                  weatherData.cloudCovers[0],
                  weatherData.precipitationProbabilitiesHourly[0]
                )}
                alt="teste"
                width={60}
                height={80}
                priority
              />
              <h4 className="text-xl">
                {chooseCloudText(
                  weatherData.cloudCovers[0],
                  weatherData.precipitationProbabilitiesHourly[0]
                )}
              </h4>
              <h4 className="font-semibold text-xl">
                {(weatherData.next30ChartData &&
                  weatherData.next30ChartData[0].temperatureMax) ||
                  "0"}{" "}
                °C /{" "}
                {(weatherData.next30ChartData &&
                  weatherData.next30ChartData[0].temperatureMin) ||
                  "0"}{" "}
                °C
              </h4>
            </div>
            <div className="border-2 rounded-xs w-full flex flex-row border-gray-300 text-xl">
              <div className="w-1/2 flex flex-col py-8 pl-8 pr-4">
                <h1>
                  Umidade:{" "}
                  <span className="font-semibold">
                    {(weatherData.humidities && weatherData.humidities[0]) || "0"}%
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Possibilidade de chuva:{" "}
                  <span className="font-semibold">
                    {(weatherData.precipitationProbabilitiesHourly &&
                      weatherData.precipitationProbabilitiesHourly[0]) ||
                      "0"}
                    %
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Vento:{" "}
                  <span className="font-semibold">
                    {(weatherData.windSpeeds && weatherData.windSpeeds[0]) || "0"} km/h
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Índice UV:{" "}
                  <span className="font-semibold">
                    {(weatherData.uvIndex && weatherData.uvIndex[0]) || "0"}
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Cobertura Nuvens:{" "}
                  <span className="font-semibold">
                    {(weatherData.cloudCovers && weatherData.cloudCovers[0]) || "0"}%
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Anoitecer:{" "}
                  <span className="font-semibold">
                    {(weatherData.sunset && weatherData.sunset) || "18:00"}
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1" />
              </div>
              <div className="w-1/2 flex flex-col py-8 pr-8 pl-4">
                <h1>
                  Precipitação:{" "}
                  <span className="font-semibold">
                    {(weatherData.precipitations && weatherData.precipitations[0]) || "0"} mm
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Pressão:{" "}
                  <span className="font-semibold">
                    {(weatherData.pressures && weatherData.pressures[0]) || "0"} hPa
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Rajadas:{" "}
                  <span className="font-semibold">
                    {(weatherData.rajadas && weatherData.rajadas[0]) || "0"}%
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Ponto Orvalho:{" "}
                  <span className="font-semibold">
                    {(weatherData.dewPointTemperatures &&
                      weatherData.dewPointTemperatures[0]) ||
                      "0"}{" "}
                    °C
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
                <h1>
                  Amanhecer:{" "}
                  <span className="font-semibold">
                    {(weatherData.sunrise && weatherData.sunrise) || "06:00"}
                  </span>
                </h1>
                <Separator className="bg-gray-300 rounded-full py-[1px] mt-1 mb-11" />
              </div>
            </div>
          </div>

          {/* MAPA GRANDE */}
          <h1 className="text-4xl font-semibold py-8">Mapa - Tempo Real</h1>
          <div className="flex items-center justify-center rounded-lg w-full h-[620px]">
            <iframe
              src={`https://maps.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}&hl=es;z=14&output=embed`}
              loading="lazy"
              className="rounded-lg w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
