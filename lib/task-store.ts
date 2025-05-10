"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task } from "./types"
import { v4 as uuidv4 } from "uuid"

interface TaskStore {
  tasks: Task[]
  selectedTask: Task | null
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void
  editTask: (task: Task) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  setSelectedTask: (task: Task | null) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      selectedTask: null,

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: uuidv4(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      editTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
        })),

      setSelectedTask: (task) =>
        set(() => ({
          selectedTask: task,
        })),
    }),
    {
      name: "task-storage",
    },
  ),
)
