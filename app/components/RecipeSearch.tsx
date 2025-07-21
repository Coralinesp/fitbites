"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Clock, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Recipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  nutrition?: {
    calories: number
  }
  sourceUrl: string
}

export default function RecipeSearch() {
  const [query, setQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [mealType, setMealType] = useState("")
  const [diet, setDiet] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const mealTypes = [
    { value: "", label: "Todos" },
    { value: "breakfast", label: "Desayuno" },
    { value: "lunch", label: "Almuerzo" },
    { value: "dinner", label: "Cena" },
    { value: "snack", label: "Snack" },
  ]

  const diets = [
    { value: "", label: "Sin restricciones" },
    { value: "vegetarian", label: "Vegetariano" },
    { value: "vegan", label: "Vegano" },
    { value: "gluten-free", label: "Sin gluten" },
    { value: "ketogenic", label: "Keto" },
    { value: "paleo", label: "Paleo" },
  ]

  const searchRecipes = async () => {
    setLoading(true)
    try {
      const searchTerm = query.trim() === "" ? "chicken" : query.trim()

      const response = await fetch("/api/recipes/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchTerm,
          type: mealType,
          diet,
        }),
      })

      const data = await response.json()
      setRecipes(data.results || [])
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching recipes:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchRecipes()
  }

  useEffect(() => {
    if (!hasSearched) {
      const fetchDefaultRecipes = async () => {
        setLoading(true)
        try {
          const response = await fetch("/api/recipes/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "chicken", type: "", diet: "" }),
          })
          const data = await response.json()
          setRecipes(data.results || [])
          setHasSearched(true)
        } catch (error) {
          console.error("Error cargando recetas por defecto:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchDefaultRecipes()
    }
  }, [hasSearched])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Buscar Recetas</h2>
        <p className="text-gray-600">Encuentra recetas deliciosas y saludables</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar recetas... (ej: pollo, pasta, ensalada)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {mealTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {diets.map((dietOption) => (
                    <option key={dietOption.value} value={dietOption.value}>
                      {dietOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={recipe.image || "/placeholder.svg?height=200&width=300&query=recipe"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.readyInMinutes} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} porciones</span>
                  </div>
                </div>

                {recipe.nutrition && (
                  <div className="bg-green-50 rounded-lg p-2 mb-3">
                    <p className="text-sm font-medium text-green-800">
                      ~{Math.round(recipe.nutrition.calories)} calorías por porción
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => window.open(recipe.sourceUrl, "_blank")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Ver Receta Completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Buscando recetas...</p>
        </div>
      )}
    </div>
  )
}
