"use client"

import { MainNav } from "@/components/main-nav"
import CategoryManager from "@/components/category-manager"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <div className="flex-1 container py-6 md:py-8">
        <h1 className="text-2xl font-medium text-slate-900 mb-6">Gestión de Categorías</h1>
        <div className="max-w-md mx-auto">
          <CategoryManager />
        </div>
      </div>
    </main>
  )
}
