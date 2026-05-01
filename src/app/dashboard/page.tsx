import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import DashboardClient from './DashboardClient'

async function getAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/login')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    
    if (!user) redirect('/login')

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Prepare data for client component
    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
      todos: todos.map(todo => ({
        ...todo,
        dueDate: todo.dueDate?.toISOString() || null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
      })),
    }
  } catch (error) {
    redirect('/login')
  }
}

export default async function DashboardPage() {
  const data = await getAuth()
  // Use a key to force re-render when data changes (e.g. after revalidatePath)
  const key = `${data.user.id}-${data.todos.length}-${data.todos[0]?.updatedAt || ''}`
  return <DashboardClient key={key} initialUser={data.user} initialTodos={data.todos} />
}