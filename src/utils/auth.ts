import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function verifyAuth(req: NextRequest): number | null {
  try {
    const token = req.cookies.get('token')?.value || 
                  req.headers.get('authorization')?.replace('Bearer ', '')
    
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