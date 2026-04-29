import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { loginSchema } from '@/validations/user'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { error } = loginSchema.validate(body)
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      )
    }

    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    )

    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(
      { message: 'Login successful', user: userWithoutPassword, token },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
