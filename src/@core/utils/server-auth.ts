import jwt from 'jsonwebtoken'

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