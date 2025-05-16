"use client"

import { useState } from "react"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, RotateCcw, Calendar, Tag } from "lucide-react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskListProps {
  filter: "pending" | "completed"
}

export default function TaskList({ filter }: TaskListProps) {
  const { tasks, categories, toggleTaskCompletion, deleteTask, setSelectedTask } = useTaskStore()
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Filter tasks based on completion status and category
  const filteredTasks = tasks.filter((task) => {
    const matchesCompletionFilter = filter === "completed" ? task.completed : !task.completed
    const matchesCategoryFilter = categoryFilter === "all" || task.category === categoryFilter
    return matchesCompletionFilter && matchesCategoryFilter
  })

  // Sort tasks by due date (most urgent first for pending, most recent first for completed)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (filter === "pending") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    }
  })

  // Get badge color based on due date
  const getDueDateBadgeColor = (task: Task) => {
    if (task.completed) return "bg-green-600"

    const dueDate = new Date(task.dueDate)
    if (isPast(dueDate) && !isToday(dueDate)) return "bg-red-600"
    if (isToday(dueDate)) return "bg-amber-600"
    if (isTomorrow(dueDate)) return "bg-blue-600"
    return "bg-slate-600"
  }

  // Get human-readable due date text
  const getDueDateText = (task: Task) => {
    const dueDate = new Date(task.dueDate)

    if (isToday(dueDate)) return "Hoy"
    if (isTomorrow(dueDate)) return "Mañana"

    return format(dueDate, "PPP", { locale: es })
  }

  // Get recurrence text
  const getRecurrenceText = (task: Task) => {
    if (!task.isRecurring || !task.recurrence) return null

    const { type, count } = task.recurrence

    switch (type) {
      case "daily":
        return `${count} ${count === 1 ? "vez" : "veces"} al día`
      case "weekly":
        return `${count} ${count === 1 ? "vez" : "veces"} a la semana`
      case "monthly":
        return `${count} ${count === 1 ? "vez" : "veces"} al mes`
      default:
        return null
    }
  }

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.color || "#6200ee"
  }

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "General"
  }

  // Handle delete confirmation
  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete)
      setTaskToDelete(null)
    }
  }

  const cancelDelete = () => {
    setTaskToDelete(null)
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-900">
          {filter === "pending" ? "Tareas Pendientes" : "Tareas Completadas"}
        </h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="categoryFilter" className="sr-only">
            Filtrar por categoría
          </Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="categoryFilter" className="w-[180px] bg-white text-slate-900 border-slate-300">
              <SelectValue placeholder="Todas las categorías" className="text-slate-900" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="text-slate-900">
                Todas las categorías
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="text-slate-900">
                  <div className="flex items-center">
                    <Badge className="mr-2 h-2 w-2 rounded-full p-1" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-600">
            {filter === "pending"
              ? categoryFilter === "all"
                ? "No hay tareas pendientes. ¡Buen trabajo!"
                : `No hay tareas pendientes en esta categoría.`
              : categoryFilter === "all"
                ? "No hay tareas completadas aún."
                : "No hay tareas completadas en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "transition-all rounded-lg shadow-md overflow-hidden border-0",
                task.completed ? "bg-white" : "bg-white",
              )}
            >
              <CardHeader className="pb-2 px-4 pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1 rounded-full border-2 border-slate-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <div>
                      <CardTitle
                        className={cn(
                          "text-lg font-medium text-slate-900",
                          task.completed && "line-through text-slate-500",
                        )}
                      >
                        {task.title}
                      </CardTitle>
                      {task.description && (
                        <CardDescription
                          className={cn("mt-1 text-slate-700", task.completed && "line-through text-slate-400")}
                        >
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-white rounded-full px-2 py-0.5 text-xs font-medium pointer-events-none",
                        getDueDateBadgeColor(task),
                      )}
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      {getDueDateText(task)}
                    </Badge>

                    {task.category && (
                      <Badge
                        variant="outline"
                        className="border-0 rounded-full px-2 py-0.5 text-xs font-medium pointer-events-none"
                        style={{ backgroundColor: `${getCategoryColor(task.category)}20` }}
                      >
                        <Tag className="mr-1 h-3 w-3" style={{ color: getCategoryColor(task.category) }} />
                        <span style={{ color: getCategoryColor(task.category) }}>{getCategoryName(task.category)}</span>
                      </Badge>
                    )}

                    {task.isRecurring && task.recurrence && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-2 py-0.5 text-xs font-medium pointer-events-none border border-slate-200 text-slate-700"
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        {getRecurrenceText(task)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="pt-2 px-4 pb-4">
                <div className="flex justify-end gap-2 w-full">
                  {!task.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                      className="rounded-full text-primary-600 border-primary-200 hover:bg-primary-50 bg-white"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(task.id)}
                    className="rounded-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!taskToDelete} onOpenChange={(open) => !open && cancelDelete()}>
        <DialogContent className="rounded-lg sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-slate-900">Confirmar eliminación</DialogTitle>
            <DialogDescription className="text-slate-600">
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
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
