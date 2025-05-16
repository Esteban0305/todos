import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import { MainNav } from "@/components/main-nav"
import ServiceWorkerRegister from "./sw-register"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainNav />
      <div className="flex-1 container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <TaskForm />
          </div>
          <div className="md:w-2/3">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-slate-100">
                <TabsTrigger
                  value="pending"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm"
                >
                  Pendientes
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm"
                >
                  Completadas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                <Suspense
                  fallback={<div className="p-4 text-center text-slate-500">Cargando tareas pendientes...</div>}
                >
                  <TaskList filter="pending" />
                </Suspense>
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <Suspense
                  fallback={<div className="p-4 text-center text-slate-500">Cargando tareas completadas...</div>}
                >
                  <TaskList filter="completed" />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <ServiceWorkerRegister />
    </main>
  )
}
