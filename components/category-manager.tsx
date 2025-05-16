"use client"

import type React from "react"

import { useState } from "react"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Category } from "@/lib/types"

export default function CategoryManager() {
  const { categories, addCategory, editCategory, deleteCategory } = useTaskStore()

  const [name, setName] = useState("")
  const [color, setColor] = useState("#6200ee")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const resetForm = () => {
    setName("")
    setColor("#6200ee")
    setEditingCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      editCategory({
        ...editingCategory,
        name,
        color,
      })
    } else {
      addCategory({
        name,
        color,
      })
    }

    resetForm()
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setColor(category.color)
  }

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete)
      setCategoryToDelete(null)
    }
  }

  const cancelDelete = () => {
    setCategoryToDelete(null)
  }

  return (
    <div>
      <Card className="rounded-lg shadow-md border-0 overflow-hidden bg-white">
        <CardHeader className="bg-primary-50 pb-3">
          <CardTitle className="text-xl font-medium text-primary-700">
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Nombre
              </Label>
              <Input
                id="name"
                placeholder="Nombre de la categoría"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium text-slate-700">
                Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1 rounded-md"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-sm font-medium text-slate-700">Vista previa</Label>
              <div className="mt-2 p-3 border rounded-md bg-white">
                <Badge
                  variant="outline"
                  className="border-0 rounded-full px-3 py-1"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <span className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: color }}></span>
                  <span style={{ color }}>{name || "Nombre de la categoría"}</span>
                </Badge>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 pb-4 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-white"
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-full bg-primary-600 hover:bg-primary-700 text-white">
              {editingCategory ? "Actualizar" : "Crear"} <Plus className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Categorías existentes</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center">
                <Badge className="mr-3 h-3 w-3 rounded-full p-1.5" style={{ backgroundColor: category.color }} />
                <span className="font-medium text-slate-700">{category.name}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(category)}
                  className="rounded-full text-slate-500 hover:text-primary-600 hover:bg-primary-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {category.id !== "default" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(category.id)}
                    className="rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && cancelDelete()}>
        <DialogContent className="rounded-lg sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-slate-900">Confirmar eliminación</DialogTitle>
            <DialogDescription className="text-slate-600">
              ¿Estás seguro de que deseas eliminar esta categoría? Las tareas asociadas a esta categoría se moverán a la
              categoría "General".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="rounded-full border-slate-300 text-slate-700 bg-white"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
