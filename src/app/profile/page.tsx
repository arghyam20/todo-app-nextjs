import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import ProfileClient from './ProfileClient'

async function getAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/login')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    })
    
    if (!user) redirect('/login')

    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      }
    }
  } catch (error) {
    redirect('/login')
  }
}

export default async function ProfilePage() {
  const data = await getAuth()
  const key = `${data.user.id}-${data.user.name}-${data.user.email}-${data.user.image || ''}`
  return <ProfileClient key={key} initialUser={data.user} />
}