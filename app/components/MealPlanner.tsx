"use client"

import { useState } from "react"
import { Calendar, Plus, Trash2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Meal {
  id: string
  name: string
  calories: number
  type: "breakfast" | "lunch" | "dinner"
}

interface DayPlan {
  breakfast: Meal[]
  lunch: Meal[]
  dinner: Meal[]
}

type WeekPlan = {
  [key: string]: DayPlan
}

export default function MealPlanner() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({})
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [showAddMeal, setShowAddMeal] = useState<{ day: string; type: string } | null>(null)
  const [newMeal, setNewMeal] = useState({ name: "", calories: "" })

  const daysOfWeek = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ]

  const mealTypes = [
    { key: "breakfast", label: "Desayuno", color: "bg-yellow-100 text-yellow-800" },
    { key: "lunch", label: "Comida", color: "bg-orange-100 text-orange-800" },
    { key: "dinner", label: "Cena", color: "bg-purple-100 text-purple-800" },
  ]

  const initializeDay = (day: string) => {
    if (!weekPlan[day]) {
      setWeekPlan((prev) => ({
        ...prev,
        [day]: {
          breakfast: [],
          lunch: [],
          dinner: [],
        },
      }))
    }
  }

  const addMeal = (day: string, type: "breakfast" | "lunch" | "dinner") => {
    if (!newMeal.name || !newMeal.calories) return

    initializeDay(day)

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: Number.parseInt(newMeal.calories),
      type,
    }

    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: [...(prev[day]?.[type] || []), meal],
      },
    }))

    setNewMeal({ name: "", calories: "" })
    setShowAddMeal(null)
  }

  const removeMeal = (day: string, type: "breakfast" | "lunch" | "dinner", mealId: string) => {
    setWeekPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: prev[day]?.[type]?.filter((meal) => meal.id !== mealId) || [],
      },
    }))
  }

  const getDayCalories = (day: string) => {
    const dayPlan = weekPlan[day]
    if (!dayPlan) return 0

    return (
      (dayPlan.breakfast?.reduce((sum, meal) => sum + meal.calories, 0) || 0) +
      (dayPlan.lunch?.reduce((sum, meal) => sum + meal.calories, 0) || 0) +
      (dayPlan.dinner?.reduce((sum, meal) => sum + meal.calories, 0) || 0)
    )
  }

  const getCaloriesDifference = (day: string) => {
    const dayCalories = getDayCalories(day)
    return dayCalories - dailyGoal
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Planificador Semanal</h2>
        <p className="text-gray-600">Organiza tus comidas para toda la semana</p>
      </div>

      {/* Daily Goal Setting */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-4">
            <Target className="h-5 w-5 text-green-600" />
            <label className="font-medium text-gray-700">Objetivo diario de calorías:</label>
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number.parseInt(e.target.value) || 2000)}
              className="border border-gray-300 rounded-md px-3 py-1 w-20 text-center"
              min="1000"
              max="5000"
            />
            <span className="text-gray-600">kcal</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => {
          const dayCalories = getDayCalories(day.key)
          const difference = getCaloriesDifference(day.key)

          return (
            <Card key={day.key} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{day.label}</span>
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{dayCalories} kcal</div>
                    <div
                      className={`text-xs ${difference > 0 ? "text-red-600" : difference < -200 ? "text-blue-600" : "text-green-600"}`}
                    >
                      {difference > 0 ? "+" : ""}
                      {difference} del objetivo
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mealTypes.map((mealType) => (
                  <div key={mealType.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${mealType.color}`}>
                        {mealType.label}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddMeal({ day: day.key, type: mealType.key })}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      {weekPlan[day.key]?.[mealType.key as keyof DayPlan]?.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                            <p className="text-xs text-gray-600">{meal.calories} kcal</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeMeal(day.key, mealType.key as any, meal.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add Meal Form */}
                    {showAddMeal?.day === day.key && showAddMeal?.type === mealType.key && (
                      <div className="bg-white border rounded-lg p-3 space-y-2">
                        <input
                          type="text"
                          placeholder="Nombre de la comida"
                          value={newMeal.name}
                          onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Calorías"
                          value={newMeal.calories}
                          onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => addMeal(day.key, mealType.key as any)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Agregar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowAddMeal(null)} className="flex-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(weekPlan).reduce((total, day) => total + getDayCalories(day), 0)}
              </div>
              <p className="text-sm text-gray-600">Calorías totales</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(Object.keys(weekPlan).reduce((total, day) => total + getDayCalories(day), 0) / 7)}
              </div>
              <p className="text-sm text-gray-600">Promedio diario</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dailyGoal * 7}</div>
              <p className="text-sm text-gray-600">Objetivo semanal</p>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  Object.keys(weekPlan).reduce((total, day) => total + getDayCalories(day), 0) > dailyGoal * 7
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {Object.keys(weekPlan).reduce((total, day) => total + getDayCalories(day), 0) - dailyGoal * 7 > 0
                  ? "+"
                  : ""}
                {Object.keys(weekPlan).reduce((total, day) => total + getDayCalories(day), 0) - dailyGoal * 7}
              </div>
              <p className="text-sm text-gray-600">Diferencia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
