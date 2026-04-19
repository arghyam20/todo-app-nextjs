'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, AuthContextType } from '@/types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me')
            setUser(response.data.user)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const response = await axios.post('/api/auth/login', { email, password })
        setUser(response.data.user)
        router.push('/dashboard')
    }

    const signup = async (name: string, email: string, password: string) => {
        await axios.post('/api/auth/signup', { name, email, password })
        await login(email, password)
    }

    const logout = async () => {
        await axios.post('/api/auth/logout')
        setUser(null)
        router.push('/login')
    }

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}