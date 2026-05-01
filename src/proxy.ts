import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/auth'

// API Handlers
import { POST as signupHandler } from '@/api/auth/signup/handler'
import { POST as loginHandler } from '@/api/auth/login/handler'
import { POST as logoutHandler } from '@/api/auth/logout/handler'
import { GET as meGET, PUT as mePUT } from '@/api/auth/me/handler'
import { GET as todosGET, POST as todosPOST } from '@/api/todos/handler'
import { PUT as todoPUT, DELETE as todoDELETE, PATCH as todoPATCH } from '@/api/todos/[id]/handler'
import { POST as imageUploadHandler } from '@/api/auth/me/image/handler'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // API Routing
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/auth/signup' && method === 'POST') return signupHandler(request)
    if (pathname === '/api/auth/login' && method === 'POST') return loginHandler(request)
    if (pathname === '/api/auth/logout' && method === 'POST') return logoutHandler(request)
    
    if (pathname === '/api/auth/me') {
      if (method === 'GET') return meGET(request)
      if (method === 'PUT') return mePUT(request)
    }

    if (pathname === '/api/auth/me/image' && method === 'POST') return imageUploadHandler(request)


    if (pathname === '/api/todos') {
      if (method === 'GET') return todosGET(request)
      if (method === 'POST') return todosPOST(request)
    }

    // Dynamic routes for todos
    const todoMatch = pathname.match(/^\/api\/todos\/(\d+)$/)
    if (todoMatch) {
      const id = todoMatch[1]
      const context = { params: Promise.resolve({ id }) }
      if (method === 'PUT') return todoPUT(request, context)
      if (method === 'DELETE') return todoDELETE(request, context)
      if (method === 'PATCH') return todoPATCH(request, context)
    }
  }

  // Auth Protection Logic
  const token = request.cookies.get('token')?.value
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isProtectedPage = pathname === '/dashboard' || pathname === '/profile'

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
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/login', 
    '/signup',
    '/api/:path*'
  ],
}