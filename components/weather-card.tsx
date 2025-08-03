"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Wind, RefreshCw, Thermometer, Sunrise, Sunset } from "lucide-react"

export default function WeatherCard({ weather, onRefresh }) {
  // Format time from Unix timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="w-full overflow-hidden backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl">
        <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-600/20 dark:to-cyan-600/20 pb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-shimmer" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold">{weather.name}</h2>
              <p className="text-sm text-muted-foreground">{weather.country}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="rounded-full hover:bg-primary/10 transition-all duration-300 hover:rotate-180"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="relative h-32 w-32 transform hover:scale-110 transition-transform duration-300">
                <Image
                  src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                  alt={weather.description}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <p className="mt-2 text-lg capitalize font-medium">{weather.description}</p>
              <p className="text-sm text-muted-foreground">{weather.main}</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <p className="text-7xl font-bold tracking-tighter">{Math.round(weather.temp)}°</p>
                <span className="absolute top-0 right-0 text-xl font-medium text-muted-foreground">C</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <p className="text-sm text-muted-foreground">Feels like {Math.round(weather.feels_like)}°C</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/10 dark:from-cyan-600/20 dark:to-teal-600/20 p-3 transition-all hover:from-cyan-500/20 hover:to-teal-500/20 dark:hover:from-cyan-600/30 dark:hover:to-teal-600/30 border border-cyan-200/30 dark:border-cyan-800/30 shadow-sm">
              <Droplets className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-600/20 dark:to-teal-600/20 p-3 transition-all hover:from-emerald-500/20 hover:to-teal-500/20 dark:hover:from-emerald-600/30 dark:hover:to-teal-600/30 border border-emerald-200/30 dark:border-emerald-800/30 shadow-sm">
              <Wind className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <p className="text-sm font-medium">Wind</p>
              <p className="text-lg font-semibold">{weather.wind_speed} km/h</p>
            </div>

            {weather.sunrise && (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-600/20 dark:to-orange-600/20 p-3 transition-all hover:from-amber-500/20 hover:to-orange-500/20 dark:hover:from-amber-600/30 dark:hover:to-orange-600/30 border border-amber-200/30 dark:border-amber-800/30 shadow-sm">
                <Sunrise className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                <p className="text-sm font-medium">Sunrise</p>
                <p className="text-lg font-semibold">{formatTime(weather.sunrise)}</p>
              </div>
            )}

            {weather.sunset && (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-600/20 dark:to-red-600/20 p-3 transition-all hover:from-orange-500/20 hover:to-red-500/20 dark:hover:from-orange-600/30 dark:hover:to-red-600/30 border border-orange-200/30 dark:border-orange-800/30 shadow-sm">
                <Sunset className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                <p className="text-sm font-medium">Sunset</p>
                <p className="text-lg font-semibold">{formatTime(weather.sunset)}</p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

