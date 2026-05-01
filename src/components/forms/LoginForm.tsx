'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { TextField, Button, Alert, Paper, Typography, Box } from '@mui/material'
import { loginSchema } from '@/validations/user'
import { loginAction } from '@/actions/auth'

interface LoginFormData {
    email: string
    password: string
}

export default function LoginForm() {
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: joiResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('')
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)
            
            const result = await loginAction(formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch (err: any) {
            setError('An unexpected error occurred')
        }
    }


    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h5" gutterBottom textAlign="center">
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Paper>
    )
}