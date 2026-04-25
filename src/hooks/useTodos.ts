'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Todo } from '@/types'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get('/api/todos')
      setTodos(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTodo = useCallback(async (todoData: Partial<Todo>) => {
    try {
      const response = await axios.post('/api/todos', todoData)
      setTodos(prev => [response.data, ...prev])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add todo')
      throw err
    }
  }, [])

  const updateTodo = useCallback(async (id: number, todoData: Partial<Todo>) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, todoData)
      setTodos(prev => prev.map(todo => todo.id === id ? response.data : todo))
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update todo')
      throw err
    }
  }, [])

  const toggleComplete = useCallback(async (id: number, completed: boolean) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, { completed })
      setTodos(prev => prev.map(todo => todo.id === id ? response.data : todo))
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to toggle todo')
      throw err
    }
  }, [])

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete todo')
      throw err
    }
  }, [])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await fetchTodos()
    }
    init()
    return () => { ignore = true }
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
  }
}