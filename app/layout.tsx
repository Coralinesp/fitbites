import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitBites - Tu Compañero Nutricional",
  description: "Descubre recetas saludables, calcula tu IMC y planifica tus comidas semanales con FitBites",
  keywords: "recetas saludables, calculadora IMC, planificador comidas, nutrición, fitness",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
