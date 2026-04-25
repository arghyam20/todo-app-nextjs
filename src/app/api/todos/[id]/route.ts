import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/config/database'
import { verifyAuth } from '@/utils/auth'
import { updateTodoSchema } from '@/validations/todo'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const userId = verifyAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const todoId = parseInt(id)
    const body = await req.json()
    
    const { error } = updateTodoSchema.validate(body)
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    })

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const userId = verifyAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const todoId = parseInt(id)

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    })

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id: todoId },
    })

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const userId = verifyAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const todoId = parseInt(id)
    const body = await req.json()

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    })

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        completed: body.completed,
      },
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Toggle todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}