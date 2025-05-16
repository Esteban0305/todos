export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  createdAt: string
  isRecurring: boolean
  recurrence: {
    type: "daily" | "weekly" | "monthly"
    count: number
  } | null
  category: string
}

export interface Category {
  id: string
  name: string
  color: string
}
