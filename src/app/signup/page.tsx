'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material'
import NextLink from 'next/link'
import { signupSchema } from '@/validations/user'
import { useAuth } from '@/hooks/useAuth'

interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: joiResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('')
      await signup(data.name, data.email, data.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

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

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>

            <Typography textAlign="center">
              Already have an account?{' '}
              <Link component={NextLink} href="/login" color="primary">
                Login
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}