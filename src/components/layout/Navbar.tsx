'use client'

import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material'
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const { user, logout } = useAuth()
    const router = useRouter()

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
                    Todo App
                </Typography>

                {user && (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body1">
                            Welcome, {user.name}
                        </Typography>
                        <IconButton color="inherit" onClick={() => router.push('/profile')}>
                            <PersonIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={logout}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}