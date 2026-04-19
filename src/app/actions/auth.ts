'use strict'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword, signToken } from '@/lib/auth'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Missing email or password' }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await comparePassword(password, user.password))) {
    return { error: 'Invalid email or password' }
  }

  const token = signToken({ userId: user.id, email: user.email })

  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Missing required fields' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'User already exists' }
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const token = signToken({ userId: user.id, email: user.email })

  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return { success: true }
}

export async function logout() {
  cookies().delete('token')
}
