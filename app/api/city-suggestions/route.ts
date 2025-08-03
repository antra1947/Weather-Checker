import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query || query.length < 3) {
    return NextResponse.json([])
  }

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY

    if (!API_KEY) {
      return NextResponse.json({ message: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch city suggestions")
    }

    const data = await response.json()

    // Format the response
    const suggestions = data.map((city: any) => ({
      name: city.name,
      country: city.country,
      state: city.state,
    }))

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error fetching city suggestions:", error)
    return NextResponse.json({ message: "Failed to fetch city suggestions" }, { status: 500 })
  }
}

