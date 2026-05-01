'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifyAuth } from '@/lib/auth'

export async function addTodoAction(data: { title: string; description?: string; dueDate?: string }) {
  const userId = await verifyAuth()
  if (!userId) return { error: 'Unauthorized' }

  try {
    await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId
      },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to add todo' }
  }
}

export async function toggleTodoAction(id: number, completed: boolean) {
  const userId = await verifyAuth()
  if (!userId) return { error: 'Unauthorized' }

  try {
    await prisma.todo.update({
      where: { id, userId },
      data: { completed }
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to toggle todo' }
  }
}

export async function deleteTodoAction(id: number) {
  const userId = await verifyAuth()
  if (!userId) return { error: 'Unauthorized' }

  try {
    await prisma.todo.delete({
      where: { id, userId }
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to delete todo' }
  }
}

export async function updateTodoAction(id: number, data: { title: string; description?: string; completed: boolean; dueDate?: string }) {
  const userId = await verifyAuth()
  if (!userId) return { error: 'Unauthorized' }

  try {
    await prisma.todo.update({
      where: { id, userId },
      data: {
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to update todo' }
  }
}
