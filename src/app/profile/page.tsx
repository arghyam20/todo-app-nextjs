import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/config/database'
import { verifyToken } from '@/utils/auth'
import ProfileClient from './ProfileClient'

async function getUser() {
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
            updatedAt: true,
        },
    })

    if (!user) {
        redirect('/login')
    }

    return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    }
}

export default async function ProfilePage() {
    const user = await getUser()
    return <ProfileClient initialUser={user} />
}