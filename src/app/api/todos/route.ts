import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/database'
import { verifyAuth } from '@/utils/auth'
import { todoSchema } from '@/validations/todo'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.error('Get todos error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = verifyAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    const { error } = todoSchema.validate(body)
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId,
      },
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Create todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}