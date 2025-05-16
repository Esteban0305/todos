"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function TaskForm() {
  const { addTask, editTask, selectedTask, setSelectedTask, categories } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [recurrenceCount, setRecurrenceCount] = useState(1)
  const [category, setCategory] = useState("default")
  const [dateError, setDateError] = useState<string | null>(null)

  // Reset form or populate with selected task
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate(new Date())
    setIsRecurring(false)
    setRecurrenceType("daily")
    setRecurrenceCount(1)
    setCategory("default")
    setDateError(null)
    setSelectedTask(null)
  }

  // Validate date is not before today
  const validateDate = (date: Date) => {
    const today = startOfDay(new Date())
    if (isBefore(date, today)) {
      setDateError("La fecha no puede ser anterior a hoy")
      return false
    }
    setDateError(null)
    return true
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (validateDate(date)) {
      setDueDate(date)
    } else {
      // Keep the current date if the new one is invalid
      setDueDate(dueDate)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateDate(dueDate)) {
      return
    }

    const taskData: Omit<Task, "id" | "completed" | "createdAt"> = {
      title,
      description,
      dueDate: dueDate.toISOString(),
      isRecurring,
      recurrence: isRecurring
        ? {
            type: recurrenceType,
            count: recurrenceCount,
          }
        : null,
      category,
    }

    if (selectedTask) {
      editTask({
        ...selectedTask,
        ...taskData,
      })
    } else {
      addTask(taskData)
    }

    resetForm()
  }

  // Populate form when a task is selected for editing
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title)
      setDescription(selectedTask.description)
      setDueDate(new Date(selectedTask.dueDate))
      setIsRecurring(selectedTask.isRecurring)
      setCategory(selectedTask.category || "default")
      if (selectedTask.recurrence) {
        setRecurrenceType(selectedTask.recurrence.type)
        setRecurrenceCount(selectedTask.recurrence.count)
      }
    }
  }, [selectedTask])

  return (
    <Card className="rounded-lg shadow-md border-0 overflow-hidden bg-white">
      <CardHeader className="bg-primary-50 pb-3">
        <CardTitle className="text-xl font-medium text-primary-700">
          {selectedTask ? "Editar Tarea" : "Nueva Tarea"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Título
            </Label>
            <Input
              id="title"
              placeholder="Título de la tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Descripción
            </Label>
            <Textarea
              id="description"
              placeholder="Descripción de la tarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 resize-none bg-white text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-700">
              Categoría
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="category"
                className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
              >
                <SelectValue placeholder="Seleccionar categoría" className="text-slate-900" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center">
                      <Badge className="mr-2 h-2 w-2 rounded-full p-1" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
              Fecha límite
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-md border-slate-300 bg-white text-slate-900",
                    !dueDate && "text-slate-500",
                    dateError && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-md bg-white">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={es}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>
            {dateError && <p className="text-sm text-red-500">{dateError}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
              className="data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-slate-200 data-[state=unchecked]:border-slate-300"
            />
            <Label htmlFor="recurring" className="text-sm font-medium text-slate-700">
              Tarea recurrente
            </Label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrenceType" className="text-sm font-medium text-slate-700">
                  Frecuencia
                </Label>
                <Select
                  value={recurrenceType}
                  onValueChange={(value) => setRecurrenceType(value as "daily" | "weekly" | "monthly")}
                >
                  <SelectTrigger
                    id="recurrenceType"
                    className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
                  >
                    <SelectValue placeholder="Seleccionar frecuencia" className="text-slate-900" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md bg-white">
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceCount" className="text-sm font-medium text-slate-700">
                  Repeticiones
                </Label>
                <Input
                  id="recurrenceCount"
                  type="number"
                  min={1}
                  value={recurrenceCount}
                  onChange={(e) => setRecurrenceCount(Number.parseInt(e.target.value) || 1)}
                  className="rounded-md border-slate-300 focus:border-primary-600 focus:ring-primary-600 bg-white text-slate-900"
                />
              </div>
            </div>
          )}
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
            {selectedTask ? "Actualizar" : "Crear"} <Plus className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
