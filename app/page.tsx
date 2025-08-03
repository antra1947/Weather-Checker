"use client"

import { useState, useEffect } from "react"
import { History } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import WeatherCard from "@/components/weather-card"
import ForecastSection from "@/components/forecast-section"
import WeatherBackground from "@/components/weather-background"
import CitySearch from "@/components/city-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [recentSearches, setRecentSearches] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
  }, [recentSearches])

  // Add a city to recent searches
  const addToRecentSearches = (cityName) => {
    // Remove the city if it already exists to avoid duplicates
    const filteredSearches = recentSearches.filter((search) => search !== cityName)
    // Add the city to the beginning of the array and limit to 5 items
    const updatedSearches = [cityName, ...filteredSearches].slice(0, 5)
    setRecentSearches(updatedSearches)
  }

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true)
      setError("")

      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      const weatherData = await weatherResponse.json()

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || "Failed to fetch weather data")
      }

      // Fetch 5-day forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodeURIComponent(cityName)}`)
      const forecastData = await forecastResponse.json()

      if (!forecastResponse.ok) {
        throw new Error(forecastData.message || "Failed to fetch forecast data")
      }

      setWeather(weatherData)
      setForecast(forecastData)
      addToRecentSearches(cityName)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshWeather = async () => {
    if (weather) {
      await fetchWeatherData(weather.name)
    }
  }

  const handleRecentSearch = (cityName) => {
    setCity(cityName)
    fetchWeatherData(cityName)
  }

  const handleDropdownVisibilityChange = (isVisible) => {
    setIsDropdownVisible(isVisible)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 transition-colors duration-500 overflow-hidden">
      {/* Dynamic background based on weather */}
      <WeatherBackground weatherCondition={weather?.main} />

      <div className="w-full max-w-3xl space-y-6 relative z-10 px-4 py-6 sm:px-6 sm:py-8 rounded-2xl backdrop-blur-sm bg-white/5 dark:bg-slate-900/5 border border-white/10 dark:border-slate-800/10 shadow-xl">
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
          <div className="absolute inset-0 blur-sm bg-white/30 dark:bg-black/20 rounded-lg"></div>
  <motion.h1
    className="relative text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-500 bg-clip-text text-transparent"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    }}
  >
    Weather Checker
  </motion.h1>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-500 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.span
              className="absolute -top-2 -right-2 text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-2 py-0.5 rounded-full shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              LIVE
            </motion.span>
          </div>

          <ThemeToggle />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <CitySearch
            onCitySelect={fetchWeatherData}
            loading={loading}
            onDropdownVisibilityChange={handleDropdownVisibilityChange}
          />
        </motion.div>

        <AnimatePresence>
          {recentSearches.length > 0 && !isDropdownVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-center gap-2 relative z-10 p-3 rounded-lg backdrop-blur-md bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 shadow-sm overflow-hidden"
            >
              <History className="h-4 w-4 text-teal-500 dark:text-teal-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recent:</span>
              {recentSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors duration-200 backdrop-blur-md bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-teal-200/50 dark:border-teal-800/50 shadow-sm"
                  onClick={() => handleRecentSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              className="rounded-lg bg-destructive/15 p-4 text-destructive backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {weather && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <WeatherCard weather={weather} onRefresh={refreshWeather} />

              {forecast && <ForecastSection forecast={forecast} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

