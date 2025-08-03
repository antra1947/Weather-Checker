"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"

export default function ForecastSection({ forecast }) {
  return (
    <Card className="w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl">
      <CardHeader className="relative overflow-hidden bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-600/20 dark:to-cyan-600/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-shimmer" />
        <CardTitle className="relative z-10 text-slate-800 dark:text-slate-200">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-x-auto">
        <div className="grid grid-cols-5 gap-4 min-w-[600px]">
          {forecast.map((day, index) => (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center rounded-lg bg-gradient-to-br from-teal-500/5 to-cyan-500/5 dark:from-teal-600/10 dark:to-cyan-600/10 p-4 hover:from-teal-500/10 hover:to-cyan-500/10 dark:hover:from-teal-600/20 dark:hover:to-cyan-600/20 transition-all duration-300 transform hover:scale-105 border border-teal-200/20 dark:border-teal-800/20 shadow-sm"
            >
              <p className="font-medium text-lg">{format(new Date(day.dt * 1000), "EEE")}</p>
              <p className="text-xs text-muted-foreground mb-2">{format(new Date(day.dt * 1000), "MMM d")}</p>

              <div className="relative h-16 w-16 my-2">
                <Image
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>

              <p className="text-xl font-bold">{Math.round(day.main.temp)}°C</p>
              <p className="text-xs capitalize text-center mt-1">{day.weather[0].description}</p>

              <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground">
                <span>H: {Math.round(day.main.temp_max)}°</span>
                <span>L: {Math.round(day.main.temp_min)}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

