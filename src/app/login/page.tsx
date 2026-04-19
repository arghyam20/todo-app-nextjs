'use client'

import { Container, Box, Paper, Typography, Link } from '@mui/material'
import NextLink from 'next/link'
import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Box width="100%">
          <LoginForm />
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Link component={NextLink} href="/signup" color="primary">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}