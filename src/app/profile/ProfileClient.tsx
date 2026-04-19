'use client'

import { useState } from 'react'
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Grid,
} from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { updateProfileSchema } from '@/validations/user'
import Navbar from '@/components/layout/Navbar'
import axios from 'axios'

interface User {
    id: number
    name: string
    email: string
    createdAt: string
    updatedAt: string
}

interface ProfileClientProps {
    initialUser: User
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
    const { updateUser } = useAuth()
    const [user, setUser] = useState(initialUser)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    })
    const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' })

    const handleUpdate = async () => {
        try {
            const response = await axios.put('/api/auth/me', formData)
            setUser(response.data.user)
            updateUser(response.data.user)
            setIsEditing(false)
            setMessage({ text: 'Profile updated successfully!', type: 'success' })
            setTimeout(() => setMessage({ text: '', type: 'success' }), 3000)
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to update profile', type: 'error' })
        }
    }

    return (
        <Box>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={3} mb={3}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                            <PersonIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4">{user.name}</Typography>
                            <Typography color="textSecondary">{user.email}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 3 }}>
                            {message.text}
                        </Alert>
                    )}

                    {isEditing ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" gap={2} justifyContent="flex-end">
                                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleUpdate} variant="contained">Save Changes</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Name:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1">{user.name}</Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Email:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Member Since:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3} display="flex" justifyContent="flex-end">
                                <Button onClick={() => setIsEditing(true)} variant="contained">
                                    Edit Profile
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    )
}