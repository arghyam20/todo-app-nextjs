import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/config/database'
import { verifyToken } from '@/utils/auth'
import DashboardClient from './DashboardClient'

async function getUserAndTodos() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const userId = await verifyToken(token)

  if (!userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return {
    user,
    todos: todos.map((todo: any) => ({
      ...todo,
      dueDate: todo.dueDate?.toISOString() || null,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    })),
  }
}

export default async function DashboardPage() {
  const { user, todos } = await getUserAndTodos()
  return <DashboardClient initialUser={user} initialTodos={todos} />
}