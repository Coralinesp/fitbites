"use client"

import { useState } from "react"
import { Search, Calculator, Calendar, Utensils } from "lucide-react"
import RecipeSearch from "./components/RecipeSearch"
import BMICalculator from "./components/BMICalculator"
import MealPlanner from "./components/MealPlanner"
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState("recipes")

  const tabs = [
    { id: "recipes", label: "Recetas", icon: Search },
    { id: "calculator", label: "Calculadora IMC", icon: Calculator },
    { id: "planner", label: "Planificador", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
     {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo de FitBites"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">
              Tu compañero para una alimentación saludable
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "recipes" && <RecipeSearch />}
        {activeTab === "calculator" && <BMICalculator />}
        {activeTab === "planner" && <MealPlanner />}
      </main>
    </div>
  )
}
