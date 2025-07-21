"use client"

import { useState } from "react"
import { Calculator, Activity, Heart, TrendingUp, User, Scale, Ruler, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BMIResult {
  bmi: number
  category: string
  color: string
  description: string
  idealWeightMin: number
  idealWeightMax: number
  bmr: number
  tdee: number
}

export default function FitBitesCalculator() {
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  }

  const calculateBMI = () => {
    if (!age || !gender || !weight || !height || !activityLevel) return

    const weightNum = Number.parseFloat(weight)
    const heightNum = Number.parseFloat(height) / 100 // Convert cm to m
    const ageNum = Number.parseInt(age)

    const bmi = weightNum / (heightNum * heightNum)

    let category = ""
    let color = ""
    let description = ""

    if (bmi < 18.5) {
      category = "Bajo peso"
      color = "text-blue-600"
      description = "Considera consultar con un nutricionista para alcanzar un peso saludable"
    } else if (bmi < 25) {
      category = "Peso normal"
      color = "text-green-600"
      description = "¡Excelente! Mantén tus hábitos saludables"
    } else if (bmi < 30) {
      category = "Sobrepeso"
      color = "text-yellow-600"
      description = "Considera hacer cambios en tu dieta y aumentar la actividad física"
    } else {
      category = "Obesidad"
      color = "text-red-600"
      description = "Te recomendamos consultar con un profesional de la salud"
    }

    // Calculate ideal weight range (BMI 18.5-24.9)
    const idealWeightMin = 18.5 * heightNum * heightNum
    const idealWeightMax = 24.9 * heightNum * heightNum

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * Number.parseFloat(height) - 5 * ageNum + 5
    } else {
      bmr = 10 * weightNum + 6.25 * Number.parseFloat(height) - 5 * ageNum - 161
    }

    // Calculate TDEE
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers]
    const tdee = bmr * multiplier

    setResult({
      bmi,
      category,
      color,
      description,
      idealWeightMin,
      idealWeightMax,
      bmr,
      tdee,
    })
  }

  const getBMIProgress = (bmi: number) => {
    // Map BMI to progress bar (0-100)
    if (bmi <= 18.5) return (bmi / 18.5) * 25
    if (bmi <= 25) return 25 + ((bmi - 18.5) / 6.5) * 50
    if (bmi <= 30) return 75 + ((bmi - 25) / 5) * 25
    return 100
  }
  const getCalorieRecommendation = (tdee: number) => {
  return {
    loseFat: Math.round(tdee - 400), // déficit moderado
    maintain: Math.round(tdee),
    gainMuscle: Math.round(tdee + 300), // superávit moderado
  }
}

  return (
    <div className="min-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de IMC</h2>
          <p className="text-lg text-gray-600">Calcula tu Índice de Masa Corporal y gasto calórico diario</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span>Datos Personales</span>
              </CardTitle>
              <CardDescription>Ingresa tu información para obtener resultados precisos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Edad (años)</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span>Peso (kg)</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4" />
                    <span>Altura (cm)</span>
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Nivel de Actividad</span>
                </Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentario (poco o ningún ejercicio)</SelectItem>
                    <SelectItem value="light">Ligero (ejercicio ligero 1-3 días/semana)</SelectItem>
                    <SelectItem value="moderate">Moderado (ejercicio moderado 3-5 días/semana)</SelectItem>
                    <SelectItem value="active">Activo (ejercicio intenso 6-7 días/semana)</SelectItem>
                    <SelectItem value="veryActive">Muy activo (ejercicio muy intenso, trabajo físico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateBMI}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 text-lg"
                disabled={!age || !gender || !weight || !height || !activityLevel}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular IMC
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Resultados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BMI Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{result.bmi.toFixed(1)}</div>
                  <Badge variant="secondary" className={`${result.color} text-lg px-4 py-2`}>
                    {result.category}
                  </Badge>
                  <p className="text-gray-600 mt-2">{result.description}</p>
                </div>

                {/* BMI Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Bajo peso</span>
                    <span>Normal</span>
                    <span>Sobrepeso</span>
                    <span>Obesidad</span>
                  </div>
                  <Progress value={getBMIProgress(result.bmi)} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{"<18.5"}</span>
                    <span>18.5-24.9</span>
                    <span>25-29.9</span>
                    <span>{"≥30"}</span>
                  </div>
                </div>

                <Separator />

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Peso Ideal</div>
                    <div className="text-lg font-semibold text-blue-800">
                      {result.idealWeightMin.toFixed(1)} - {result.idealWeightMax.toFixed(1)} kg
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Metabolismo Basal</div>
                    <div className="text-lg font-semibold text-green-800">{Math.round(result.bmr)} kcal/día</div>
                  </div>
                </div>
                  {/* Calorie Recommendation */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Calorías Recomendadas según tu objetivo</div>
                    <div className="text-sm text-gray-700 mt-2 space-y-1">
                      {(() => {
                        const recommendation = getCalorieRecommendation(result.tdee)
                        return (
                          <>
                            <div>🔻 Para perder grasa: <strong>{recommendation.loseFat} kcal/día</strong></div>
                            <div>⚖️ Para mantener tu peso: <strong>{recommendation.maintain} kcal/día</strong></div>
                            <div>🔺 Para ganar masa muscular: <strong>{recommendation.gainMuscle} kcal/día</strong></div>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Gasto Calórico Total</div>
                  <div className="text-xl font-semibold text-purple-800">{Math.round(result.tdee)} kcal/día</div>
                  <div className="text-xs text-purple-600 mt-1">Incluye actividad física y metabolismo basal</div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Recomendaciones:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mantén una dieta equilibrada rica en frutas y verduras</li>
                    <li>• Realiza al menos 150 minutos de ejercicio moderado por semana</li>
                    <li>• Bebe suficiente agua (8-10 vasos al día)</li>
                    <li>• Consulta con un profesional de la salud para un plan personalizado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
    </div>
  )
}
