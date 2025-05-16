"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Category } from "./types"
import { v4 as uuidv4 } from "uuid"
import { startOfDay, addDays, addWeeks, addMonths, isBefore } from "date-fns"

interface TaskStore {
  tasks: Task[]
  categories: Category[]
  selectedTask: Task | null
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void
  editTask: (task: Task) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  setSelectedTask: (task: Task | null) => void
  addCategory: (category: Omit<Category, "id">) => void
  editCategory: (category: Category) => void
  deleteCategory: (id: string) => void
}

// Predefined categories
const defaultCategories: Category[] = [
  { id: "default", name: "General", color: "#6366f1" },
  { id: "work", name: "Trabajo", color: "#f59e0b" },
  { id: "personal", name: "Personal", color: "#10b981" },
  { id: "health", name: "Salud", color: "#ef4444" },
  { id: "shopping", name: "Compras", color: "#8b5cf6" },
]

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      selectedTask: null,

      addTask: (taskData) => {
        const { isRecurring, recurrence, dueDate, ...rest } = taskData

        // If it's not a recurring task, just add it normally
        if (!isRecurring || !recurrence) {
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
          }))
          return
        }

        // For recurring tasks, create multiple instances
        const { type, count } = recurrence
        const dueDateObj = new Date(dueDate)
        const today = startOfDay(new Date())
        const newTasks: Task[] = []

        // Calculate interval based on recurrence type
        let currentDate = today
        let instanceCount = 0

        while (instanceCount < count && isBefore(currentDate, dueDateObj)) {
          // Create a new task instance
          newTasks.push({
            ...rest,
            dueDate: currentDate.toISOString(),
            isRecurring: true,
            recurrence,
            id: uuidv4(),
            completed: false,
            createdAt: new Date().toISOString(),
            category: taskData.category || "default",
          })

          instanceCount++

          // Increment date based on recurrence type
          switch (type) {
            case "daily":
              currentDate = addDays(currentDate, 1)
              break
            case "weekly":
              currentDate = addWeeks(currentDate, 1)
              break
            case "monthly":
              currentDate = addMonths(currentDate, 1)
              break
          }
        }

        set((state) => ({
          tasks: [...state.tasks, ...newTasks],
        }))
      },

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

      addCategory: (categoryData) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...categoryData,
              id: uuidv4(),
            },
          ],
        })),

      editCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        })),

      deleteCategory: (id) => {
        // Don't allow deleting the default category
        if (id === "default") return

        set((state) => {
          // Update all tasks with this category to use the default category
          const updatedTasks = state.tasks.map((task) =>
            task.category === id ? { ...task, category: "default" } : task,
          )

          return {
            categories: state.categories.filter((category) => category.id !== id),
            tasks: updatedTasks,
          }
        })
      },
    }),
    {
      name: "task-storage",
    },
  ),
)
