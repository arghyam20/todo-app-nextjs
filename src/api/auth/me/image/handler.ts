import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/database'
import { verifyAuth } from '@/utils/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const userId = verifyAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure safe filename
    const ext = path.extname(file.name)
    const filename = `${userId}-${Date.now()}${ext}`
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename)
    
    await writeFile(uploadPath, buffer)

    const imageUrl = `/uploads/${filename}`

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
