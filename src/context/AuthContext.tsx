'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types'
import { logoutAction } from '@/actions/auth'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
    const [user, setUser] = useState<User | null>(initialUser)
    const [loading, setLoading] = useState(false)

    // Sync with server-provided user
    useEffect(() => {
        setUser(initialUser)
    }, [initialUser])

    const login = async () => {
        // Redirection and state are handled by Server Actions
    }

    const signup = async () => {
        // Redirection and state are handled by Server Actions
    }

    const logout = async () => {
        await logoutAction()
        setUser(null)
    }

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login: () => Promise.resolve(), // Legacy support
            signup: () => Promise.resolve(), // Legacy support
            logout, 
            updateUser 
        }}>
            {children}
        </AuthContext.Provider>
    )
}