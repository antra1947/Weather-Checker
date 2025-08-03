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
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      )

      const data = await response.json()

      if (data.cod !== "200") {
        return NextResponse.json({ message: data.message || "City not found" }, { status: 404 })
      }

      // Process the forecast data to get one forecast per day
      const dailyForecasts = data.list
        .filter((forecast, index) => {
          // Get one forecast per day (at noon)
          const forecastDate = new Date(forecast.dt * 1000)
          const hour = forecastDate.getHours()
          return hour >= 12 && hour < 15
        })
        .slice(0, 5) // Limit to 5 days

      return NextResponse.json(dailyForecasts)
    } catch (error) {
      console.error("Error fetching forecast data:", error)
      return NextResponse.json({ message: "Failed to fetch forecast data" }, { status: 500 })
    }
  }

