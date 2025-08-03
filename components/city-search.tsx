"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type CitySuggestion = {
  name: string
  country: string
  state?: string
}

interface CitySearchProps {
  onCitySelect: (city: string) => void
  loading: boolean
  onDropdownVisibilityChange: (isVisible: boolean) => void
}

export default function CitySearch({ onCitySelect, loading, onDropdownVisibilityChange }: CitySearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Notify parent component when dropdown visibility changes
  useEffect(() => {
    onDropdownVisibilityChange(showSuggestions)
  }, [showSuggestions, onDropdownVisibilityChange])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      fetchCitySuggestions(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const fetchCitySuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) return

    setIsFetching(true)
    try {
      const response = await fetch(`/api/city-suggestions?query=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onCitySelect(query)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setQuery(suggestion.name)
    onCitySelect(suggestion.name)
    setShowSuggestions(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 relative z-20">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-none shadow-md focus-visible:ring-blue-500"
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-indigo-700 shadow-md"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2">Search</span>
        </Button>
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full max-h-48 rounded-md backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-lg border border-gray-200 dark:border-gray-700 overflow-auto"
            style={{ maxHeight: "180px" }}
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion.state && `${suggestion.state}, `}
                      {suggestion.country}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

