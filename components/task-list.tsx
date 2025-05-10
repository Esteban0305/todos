"use client"

import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, RotateCcw, Calendar } from "lucide-react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TaskListProps {
  filter: "pending" | "completed"
}

export default function TaskList({ filter }: TaskListProps) {
  const { tasks, toggleTaskCompletion, deleteTask, setSelectedTask } = useTaskStore()

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter((task) => (filter === "completed" ? task.completed : !task.completed))

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
    if (task.completed) return "bg-green-500"

    const dueDate = new Date(task.dueDate)
    if (isPast(dueDate) && !isToday(dueDate)) return "bg-red-500"
    if (isToday(dueDate)) return "bg-yellow-500"
    if (isTomorrow(dueDate)) return "bg-blue-500"
    return "bg-slate-500"
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

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          {filter === "pending" ? "No hay tareas pendientes. ¡Buen trabajo!" : "No hay tareas completadas aún."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <Card key={task.id} className={cn("transition-all", task.completed && "bg-muted/50")}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div>
                  <CardTitle className={cn("text-lg", task.completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </CardTitle>
                  {task.description && (
                    <CardDescription className={cn("mt-1", task.completed && "line-through")}>
                      {task.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Badge variant="secondary" className={cn("text-white", getDueDateBadgeColor(task))}>
                  <Calendar className="mr-1 h-3 w-3" />
                  {getDueDateText(task)}
                </Badge>

                {task.isRecurring && task.recurrence && (
                  <Badge variant="outline">
                    <RotateCcw className="mr-1 h-3 w-3" />
                    {getRecurrenceText(task)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardFooter className="pt-2">
            <div className="flex justify-end gap-2 w-full">
              {!task.completed && (
                <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
