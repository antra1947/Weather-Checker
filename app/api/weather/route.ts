import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ message: "City parameter is required" }, { status: 400 })
  }

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY

    if (!API_KEY) {
      return NextResponse.json({ message: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    )

    const data = await response.json()

    if (data.cod !== 200) {
      return NextResponse.json({ message: data.message || "City not found" }, { status: 404 })
    }

    // Format the response to include only what we need
    const formattedData = {
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      main: data.weather[0].main,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility,
      wind_deg: data.wind.deg,
      clouds: data.clouds?.all,
      timezone: data.timezone,
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ message: "Failed to fetch weather data" }, { status: 500 })
  }
}

