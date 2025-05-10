import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import { MainNav } from "@/components/main-nav"
import ServiceWorkerRegister from "./sw-register"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 container py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <TaskForm />
          </div>
          <div className="md:w-2/3">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="completed">Completadas</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <Suspense fallback={<div>Cargando tareas pendientes...</div>}>
                  <TaskList filter="pending" />
                </Suspense>
              </TabsContent>
              <TabsContent value="completed">
                <Suspense fallback={<div>Cargando tareas completadas...</div>}>
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
