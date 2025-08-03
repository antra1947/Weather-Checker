  "use client"

  import { useEffect, useState } from "react"
  import { motion } from "framer-motion"
  import WeatherParticles from "./weather-particles"

  type WeatherBackgroundProps = {
    weatherCondition?: string
  }

  export default function WeatherBackground({ weatherCondition = "default" }: WeatherBackgroundProps) {
    const [particleType, setParticleType] = useState<
      "clear" | "clouds" | "rain" | "snow" | "mist" | "thunderstorm" | "default"
    >("default")

    useEffect(() => {
      if (!weatherCondition) return

      const condition = weatherCondition.toLowerCase()

      if (condition.includes("clear")) {
        setParticleType("clear")
      } else if (condition.includes("cloud")) {
        setParticleType("clouds")
      } else if (condition.includes("rain") || condition.includes("drizzle")) {
        setParticleType("rain")
      } else if (condition.includes("snow")) {
        setParticleType("snow")
      } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
        setParticleType("mist")
      } else if (condition.includes("thunderstorm")) {
        setParticleType("thunderstorm")
      } else {
        setParticleType("default")
      }
    }, [weatherCondition])

    const getGradientByWeather = () => {
      if (!weatherCondition)
        return "bg-gradient-to-b from-blue-400 via-indigo-500 to-blue-600 dark:from-blue-900 dark:via-indigo-900 dark:to-slate-900"

      const condition = weatherCondition.toLowerCase()

      if (condition.includes("clear")) {
        return "bg-gradient-to-b from-sky-300 via-blue-400 to-indigo-600 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-950"
      } else if (condition.includes("cloud")) {
        return "bg-gradient-to-b from-gray-300 via-slate-400 to-blue-500 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900"
      } else if (condition.includes("rain") || condition.includes("drizzle")) {
        return "bg-gradient-to-b from-slate-400 via-blue-500 to-indigo-600 dark:from-slate-800 dark:via-blue-900 dark:to-indigo-950"
      } else if (condition.includes("snow")) {
        return "bg-gradient-to-b from-gray-100 via-blue-100 to-blue-300 dark:from-slate-700 dark:via-blue-900 dark:to-indigo-900"
      } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
        return "bg-gradient-to-b from-gray-300 via-slate-400 to-slate-500 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
      } else if (condition.includes("thunderstorm")) {
        return "bg-gradient-to-b from-gray-600 via-indigo-700 to-purple-900 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950"
      }

      return "bg-gradient-to-b from-blue-400 via-indigo-500 to-blue-600 dark:from-blue-900 dark:via-indigo-900 dark:to-slate-900"
    }

    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          className={`absolute inset-0 w-full h-full ${getGradientByWeather()} transition-colors duration-1000`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <WeatherParticles type={particleType} />

        {/* Overlay with subtle pattern */}
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>
    )
  }

