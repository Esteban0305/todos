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
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/lib/types"

export default function TaskForm() {
  const { addTask, editTask, selectedTask, setSelectedTask } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [recurrenceCount, setRecurrenceCount] = useState(1)

  // Reset form or populate with selected task
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate(new Date())
    setIsRecurring(false)
    setRecurrenceType("daily")
    setRecurrenceCount(1)
    setSelectedTask(null)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
      if (selectedTask.recurrence) {
        setRecurrenceType(selectedTask.recurrence.type)
        setRecurrenceCount(selectedTask.recurrence.count)
      }
    }
  }, [selectedTask])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedTask ? "Editar Tarea" : "Nueva Tarea"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título de la tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la tarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha límite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
            <Label htmlFor="recurring">Tarea recurrente</Label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrenceType">Frecuencia</Label>
                <Select
                  value={recurrenceType}
                  onValueChange={(value) => setRecurrenceType(value as "daily" | "weekly" | "monthly")}
                >
                  <SelectTrigger id="recurrenceType">
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceCount">Repeticiones</Label>
                <Input
                  id="recurrenceCount"
                  type="number"
                  min={1}
                  value={recurrenceCount}
                  onChange={(e) => setRecurrenceCount(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancelar
          </Button>
          <Button type="submit">
            {selectedTask ? "Actualizar" : "Crear"} <Plus className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
