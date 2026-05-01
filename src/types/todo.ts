export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  userId?: number
  createdAt: string
  updatedAt?: string
}

