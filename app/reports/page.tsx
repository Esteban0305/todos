"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"

export default function ReportsPage() {
  const { tasks } = useTaskStore()
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly")

  const now = new Date()
  const weekStart = startOfWeek(now, { locale: es })
  const weekEnd = endOfWeek(now, { locale: es })
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const periodStart = period === "weekly" ? weekStart : monthStart
  const periodEnd = period === "weekly" ? weekEnd : monthEnd

  const filteredTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return isWithinInterval(dueDate, { start: periodStart, end: periodEnd })
  })

  const completedTasks = filteredTasks.filter((task) => task.completed)
  const pendingTasks = filteredTasks.filter((task) => !task.completed)

  const completionRate = filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0

  const generateReport = () => {
    const reportData = {
      period: period === "weekly" ? "Semanal" : "Mensual",
      dateRange: `${format(periodStart, "dd/MM/yyyy")} - ${format(periodEnd, "dd/MM/yyyy")}`,
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate: `${completionRate}%`,
      tasks: filteredTasks.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: format(new Date(task.dueDate), "dd/MM/yyyy"),
        status: task.completed ? "Completada" : "Pendiente",
      })),
    }

    const reportBlob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(reportBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-tareas-${period === "weekly" ? "semanal" : "mensual"}-${format(now, "yyyy-MM-dd")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 container py-4 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "weekly" | "monthly")}>
            <TabsList>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <p>
                  {format(periodStart, "dd/MM/yyyy")} - {format(periodEnd, "dd/MM/yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedTasks.length} / {filteredTasks.length}
              </div>
              <p className="text-xs text-muted-foreground">Tasa de finalización: {completionRate}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">Por completar en este periodo</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Tareas</CardTitle>
              <CardDescription>
                Visualización de tareas completadas y pendientes en el periodo seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="flex items-end h-full w-full max-w-md mx-auto gap-4 pt-6">
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-green-500 w-20 rounded-t-md"
                      style={{
                        height: `${completedTasks.length ? Math.max(20, (completedTasks.length / filteredTasks.length) * 180) : 0}px`,
                      }}
                    ></div>
                    <span className="text-sm mt-2">Completadas</span>
                    <span className="font-bold">{completedTasks.length}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-orange-500 w-20 rounded-t-md"
                      style={{
                        height: `${pendingTasks.length ? Math.max(20, (pendingTasks.length / filteredTasks.length) * 180) : 0}px`,
                      }}
                    ></div>
                    <span className="text-sm mt-2">Pendientes</span>
                    <span className="font-bold">{pendingTasks.length}</span>
                  </div>
                </div>
                {filteredTasks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">No hay tareas en este periodo</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={generateReport}>
            <Download className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  )
}
