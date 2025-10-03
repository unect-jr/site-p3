import { NextResponse } from "next/server";

async function getWeatherData(latitude: string, longitude: string) {
    const apiKey = process.env.TOMORROW_API_KEY;
    const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude}%2C%20${longitude}&timesteps=1h%2C1d&units=metric&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching weather data from Tomorrow.io:", errorData);
        throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();

    // Process data to match the structure expected by the frontend
    const processedData = {
        sunrise: new Date(data.timelines.daily[0].values.sunriseTime).toLocaleTimeString([], { hour: "numeric", minute: "numeric" }),
        sunset: new Date(data.timelines.daily[0].values.sunsetTime).toLocaleTimeString([], { hour: "numeric", minute: "numeric" }),
        times: data.timelines.hourly.map((h: any) => new Date(h.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
        dates: data.timelines.hourly.map((h: any) => new Date(h.time).toLocaleDateString([], { day: "numeric", month: "numeric" })),
        temperatures: data.timelines.hourly.map((h: any) => Math.round(h.values.temperature)),
        feelsLike: data.timelines.hourly.map((h: any) => Math.round(h.values.temperatureApparent)),
        pressures: data.timelines.hourly.map((h: any) => h.values.pressureSeaLevel),
        cloudCovers: data.timelines.hourly.map((h: any) => h.values.cloudCover),
        windSpeeds: data.timelines.hourly.map((h: any) => h.values.windSpeed),
        rajadas: data.timelines.hourly.map((h: any) => h.values.windGust),
        humidities: data.timelines.hourly.map((h: any) => h.values.humidity),
        precipitations: data.timelines.hourly.map((h: any) => h.values.rainAccumulation),
        precipitationProbabilitiesHourly: data.timelines.hourly.map((h: any) => h.values.precipitationProbability),
        dewPointTemperatures: data.timelines.hourly.map((h: any) => h.values.dewPoint),
        uvIndex: data.timelines.hourly.map((h: any) => h.values.uvIndex || 0),
        precipitationProbabilitiesDaily: data.timelines.daily.map((d: any) => d.values.precipitationProbabilityAvg),
        tempChartData: data.timelines.hourly.map((h: any) => ({
            time: new Date(h.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            temperature: Math.round(h.values.temperature),
        })),
        rainChartData: data.timelines.hourly.map((h: any) => ({
            time: new Date(h.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            precipitation: h.values.rainAccumulation,
            precipitationProbability: h.values.precipitationProbability,
        })),
        next30ChartData: data.timelines.daily.map((d: any) => ({
            timestamp: d.time,
            date: new Date(d.time).toLocaleDateString([], { day: "numeric", month: "numeric" }),
            temperatureMax: Math.round(d.values.temperatureMax).toString(),
            temperatureMin: Math.round(d.values.temperatureMin).toString(),
            cloudCover: d.values.cloudCoverAvg,
        })),
    };

    return processedData;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ message: "Latitude and longitude are required" }, { status: 400 });
    }

    try {
        const data = await getWeatherData(lat, lon);
        return NextResponse.json(data);
    } catch (error) {
        console.error("ERRO NA ROTA /api/weather:", error);
        return NextResponse.json({ message: "Error fetching weather data" }, { status: 500 });
    }
}
