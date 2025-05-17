"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Task } from "@/lib/types"

// Extender jsPDF con autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

interface PDFExporterProps {
  period: "weekly" | "monthly"
  periodStart: Date
  periodEnd: Date
  filteredTasks: Task[]
  completedTasks: Task[]
  pendingTasks: Task[]
  completionRate: number
}

export default function PDFExporter({
  period,
  periodStart,
  periodEnd,
  filteredTasks,
  completedTasks,
  pendingTasks,
  completionRate,
}: PDFExporterProps) {
  const generatePdfReport = () => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF()

    // Añadir título
    doc.setFontSize(20)
    doc.setTextColor(98, 0, 238) // Color primario
    doc.text("Reporte de Tareas", 105, 20, { align: "center" })

    // Añadir información del periodo
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(`Periodo: ${period === "weekly" ? "Semanal" : "Mensual"}`, 105, 30, { align: "center" })
    doc.text(`Rango de fechas: ${format(periodStart, "dd/MM/yyyy")} - ${format(periodEnd, "dd/MM/yyyy")}`, 105, 38, {
      align: "center",
    })

    // Añadir resumen
    doc.setFontSize(14)
    doc.setTextColor(98, 0, 238)
    doc.text("Resumen", 20, 50)

    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(`Total de tareas: ${filteredTasks.length}`, 20, 60)
    doc.text(`Tareas completadas: ${completedTasks.length}`, 20, 68)
    doc.text(`Tareas pendientes: ${pendingTasks.length}`, 20, 76)
    doc.text(`Tasa de finalización: ${completionRate}%`, 20, 84)

    // Añadir tabla de tareas
    doc.setFontSize(14)
    doc.setTextColor(98, 0, 238)
    doc.text("Listado de Tareas", 20, 100)

    // Preparar datos de la tabla
    const tableColumn = ["Título", "Descripción", "Fecha límite", "Estado"]
    const tableRows = filteredTasks.map((task) => [
      task.title,
      task.description || "-",
      format(new Date(task.dueDate), "dd/MM/yyyy"),
      task.completed ? "Completada" : "Pendiente",
    ])

    // Añadir la tabla
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 110,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [98, 0, 238], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 250] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
      },
    })

    // Añadir pie de página
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm")} - Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" },
      )
    }

    // Guardar el PDF
    doc.save(`reporte-tareas-${period === "weekly" ? "semanal" : "mensual"}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
  }

  return (
    <Button onClick={generatePdfReport} className="rounded-full bg-primary-600 hover:bg-primary-700 text-white">
      <FileText className="mr-2 h-4 w-4" />
      Exportar PDF
    </Button>
  )
}
