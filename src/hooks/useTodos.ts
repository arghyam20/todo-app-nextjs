'use client'

import { useState, useEffect, useCallback } from 'react'
import { Todo } from '@/types'
import { 
  addTodoAction, 
  updateTodoAction, 
  toggleTodoAction, 
  deleteTodoAction 
} from '@/actions/todos'

export function useTodos(initialTodos: Todo[]) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [error, setError] = useState<string | null>(null)


  const addTodo = useCallback(async (data: { title: string; description?: string; dueDate?: string }) => {
    const result = await addTodoAction(data)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
  }, [])

  const updateTodo = useCallback(async (id: number, data: { title: string; description?: string; completed: boolean; dueDate?: string }) => {
    const result = await updateTodoAction(id, data)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
  }, [])

  const toggleComplete = useCallback(async (id: number, completed: boolean) => {
    const result = await toggleTodoAction(id, completed)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
  }, [])

  const deleteTodo = useCallback(async (id: number) => {
    const result = await deleteTodoAction(id)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
  }, [])

  return {
    todos,
    loading: false,
    error,
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
  }
}