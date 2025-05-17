"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"
import dynamic from "next/dynamic"

// Importar jsPDF y jspdf-autotable dinámicamente para evitar problemas de SSR
const PDFExporter = dynamic(() => import("@/components/pdf-exporter"), {
  ssr: false,
  loading: () => (
    <Button disabled className="rounded-full bg-primary-600 hover:bg-primary-700 text-white opacity-70">
      <FileText className="mr-2 h-4 w-4" />
      Cargando...
    </Button>
  ),
})

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <div className="flex-1 container py-6 md:py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-slate-900">Reportes y Estadísticas</h1>
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as "weekly" | "monthly")}
            className="bg-slate-100 rounded-full p-1"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="weekly"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm"
              >
                Semanal
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm"
              >
                Mensual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-lg shadow-md border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-primary-600 mr-2" />
                <p className="text-slate-800">
                  {format(periodStart, "dd/MM/yyyy")} - {format(periodEnd, "dd/MM/yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-md border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tareas Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {completedTasks.length} / {filteredTasks.length}
              </div>
              <p className="text-xs text-slate-500">Tasa de finalización: {completionRate}%</p>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-md border-0 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{pendingTasks.length}</div>
              <p className="text-xs text-slate-500">Por completar en este periodo</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="rounded-lg shadow-md border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-800">Resumen de Tareas</CardTitle>
              <CardDescription className="text-slate-500">
                Visualización de tareas completadas y pendientes en el periodo seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="flex items-end h-full w-full max-w-md mx-auto gap-8 pt-6">
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-green-500 w-24 rounded-t-lg"
                      style={{
                        height: `${
                          completedTasks.length ? Math.max(20, (completedTasks.length / filteredTasks.length) * 180) : 0
                        }px`,
                      }}
                    ></div>
                    <span className="text-sm mt-2 text-slate-600">Completadas</span>
                    <span className="font-bold text-slate-800">{completedTasks.length}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-amber-500 w-24 rounded-t-lg"
                      style={{
                        height: `${
                          pendingTasks.length ? Math.max(20, (pendingTasks.length / filteredTasks.length) * 180) : 0
                        }px`,
                      }}
                    ></div>
                    <span className="text-sm mt-2 text-slate-600">Pendientes</span>
                    <span className="font-bold text-slate-800">{pendingTasks.length}</span>
                  </div>
                </div>
                {filteredTasks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-slate-500">No hay tareas en este periodo</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <PDFExporter
            period={period}
            periodStart={periodStart}
            periodEnd={periodEnd}
            filteredTasks={filteredTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
            completionRate={completionRate}
          />
        </div>
      </div>
    </div>
  )
}
