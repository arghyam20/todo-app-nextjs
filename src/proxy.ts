import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'
  const isProtectedPage = request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname === '/profile'

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && token) {
    const userId = await verifyToken(token)
    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
}