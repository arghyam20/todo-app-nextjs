'use server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { signupBaseSchema, loginSchema } from '@/validations/user'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'

import { verifyAuth } from '@/lib/auth'

export async function signupAction(formData: FormData) {

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = signupBaseSchema.validate({ name, email, password })
  if (error) return { error: error.details[0].message }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return { error: 'User already exists' }

    await prisma.user.create({
      data: { 
        name, 
        email, 
        password: await bcrypt.hash(password, 10) 
      },
    })
  } catch (err) {
    return { error: 'Something went wrong during signup' }
  }

  return await loginAction(formData)
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = loginSchema.validate({ email, password })
  if (error) return { error: error.details[0].message }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  })

  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.set('token', '', { expires: new Date(0), path: '/' })
  redirect('/login')
}

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return { error: 'Unauthorized' }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { name, email },
    })
    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to update profile' }
  }
}

export async function uploadImageAction(formData: FormData) {
  const userId = await verifyAuth()
  if (!userId) return { error: 'Unauthorized' }

  try {
    const file = formData.get('file') as File
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${userId}-${Date.now()}${path.extname(file.name)}`
    await writeFile(path.join(process.cwd(), 'public/uploads', filename), buffer)

    await prisma.user.update({
      where: { id: userId },
      data: { image: `/uploads/${filename}` },
    })
    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    return { error: 'Upload failed' }
  }
}

