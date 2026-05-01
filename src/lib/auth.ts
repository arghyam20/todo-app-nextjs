import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function verifyAuth(req?: NextRequest): Promise<number | null> {
  try {
    let token: string | undefined

    if (req) {
      token = req.cookies.get('token')?.value || 
              req.headers.get('authorization')?.replace('Bearer ', '')
    } else {
      const cookieStore = await cookies()
      token = cookieStore.get('token')?.value
    }
    
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
    }
    
    return decoded.userId
  } catch (error) {
    return null
  }
}

export async function verifyToken(token: string): Promise<number | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
    }
    return decoded.userId
  } catch (error) {
    return null
  }
}
