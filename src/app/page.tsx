'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={4}
      >
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', width: '100%' }}>
          <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
            Todo App
          </Typography>
          <Typography variant="h5" gutterBottom color="text.secondary">
            Organize Your Tasks Efficiently
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4, maxWidth: 600, mx: 'auto' }}>
            A powerful full-stack todo application with authentication, real-time updates,
            and beautiful Material UI design. Stay organized and boost your productivity.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                size="large"
                color="primary"
              >
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                href="/signup"
                variant="outlined"
                size="large"
                color="primary"
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Secure Authentication</Typography>
              <Typography variant="body2" color="text.secondary">
                JWT-based authentication with bcrypt password hashing
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Real-time Updates</Typography>
              <Typography variant="body2" color="text.secondary">
                Instant todo updates with optimistic UI updates
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Beautiful UI</Typography>
              <Typography variant="body2" color="text.secondary">
                Modern Material Design with responsive layout
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}