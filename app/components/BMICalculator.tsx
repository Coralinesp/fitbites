"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, Activity, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BMIResult {
  bmi: number
  category: string
  calories: number
  advice: string[]
}

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activity: "sedentary",
  })
  const [result, setResult] = useState<BMIResult | null>(null)

  const activityLevels = [
    { value: "sedentary", label: "Sedentario (poco o ningún ejercicio)", multiplier: 1.2 },
    { value: "light", label: "Ligero (ejercicio ligero 1-3 días/semana)", multiplier: 1.375 },
    { value: "moderate", label: "Moderado (ejercicio moderado 3-5 días/semana)", multiplier: 1.55 },
    { value: "active", label: "Activo (ejercicio intenso 6-7 días/semana)", multiplier: 1.725 },
    { value: "very-active", label: "Muy activo (ejercicio muy intenso, trabajo físico)", multiplier: 1.9 },
  ]

  const calculateBMI = () => {
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height) / 100 // convert cm to m
    const age = Number.parseInt(formData.age)

    if (!weight || !height || !age) return

    // Calculate BMI
    const bmi = weight / (height * height)

    // Determine category
    let category = ""
    let advice: string[] = []

    if (bmi < 18.5) {
      category = "Bajo peso"
      advice = [
        "Considera aumentar tu ingesta calórica de manera saludable",
        "Incluye más proteínas y grasas saludables en tu dieta",
        "Consulta con un nutricionista para un plan personalizado",
      ]
    } else if (bmi < 25) {
      category = "Peso normal"
      advice = [
        "¡Excelente! Mantén tu peso actual con una dieta equilibrada",
        "Continúa con tu rutina de ejercicio regular",
        "Enfócate en mantener hábitos saludables",
      ]
    } else if (bmi < 30) {
      category = "Sobrepeso"
      advice = [
        "Considera reducir tu ingesta calórica gradualmente",
        "Aumenta tu actividad física diaria",
        "Enfócate en alimentos ricos en nutrientes y bajos en calorías",
      ]
    } else {
      category = "Obesidad"
      advice = [
        "Es recomendable consultar con un profesional de la salud",
        "Implementa cambios graduales en tu dieta y ejercicio",
        "Considera un plan de pérdida de peso supervisado",
      ]
    }

    // Calculate daily calories (Mifflin-St Jeor Equation)
    let bmr: number
    if (formData.gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * Number.parseFloat(formData.height) - 5.677 * age
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * Number.parseFloat(formData.height) - 4.33 * age
    }

    const activityMultiplier = activityLevels.find((level) => level.value === formData.activity)?.multiplier || 1.2
    const calories = Math.round(bmr * activityMultiplier)

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      calories,
      advice,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBMI()
  }

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600"
    if (bmi < 25) return "text-green-600"
    if (bmi < 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de IMC</h2>
        <p className="text-gray-600">Calcula tu Índice de Masa Corporal y gasto calórico diario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Datos Personales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="175"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Actividad</label>
                <select
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Calculator className="h-4 w-4 mr-2" />
                Calcular
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Resultados</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={getBMIColor(result.bmi)}>{result.bmi}</span>
                </div>
                <p className="text-lg font-medium text-gray-700">IMC</p>
                <p className={`text-sm font-medium ${getBMIColor(result.bmi)}`}>{result.category}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Calorías Diarias</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{result.calories} kcal</p>
                <p className="text-sm text-blue-700">Recomendadas para mantener tu peso actual</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Consejos Personalizados:</h4>
                <ul className="space-y-1">
                  {result.advice.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
