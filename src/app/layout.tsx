import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'


import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Full-stack Todo application with authentication',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await verifyAuth()
  let user = null
  
  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } })
    if (dbUser) {
      user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        createdAt: dbUser.createdAt.toISOString()
      }
    }
  }

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider initialUser={user}>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>

  )
}