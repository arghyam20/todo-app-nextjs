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
import { Person as PersonIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { updateProfileSchema } from '@/validations/user'
import Navbar from '@/components/layout/Navbar'
import axios from 'axios'
import { styled } from '@mui/material/styles'

const Input = styled('input')({
    display: 'none',
})

interface User {
    id: number
    name: string
    email: string
    image?: string | null
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
    const [uploading, setUploading] = useState(false)
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setUploading(true)
        try {
            const response = await axios.post('/api/auth/me/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setUser(response.data.user)
            updateUser(response.data.user)
            setMessage({ text: 'Profile image updated!', type: 'success' })
            setTimeout(() => setMessage({ text: '', type: 'success' }), 3000)
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Failed to upload image', type: 'error' })
        } finally {
            setUploading(false)
        }
    }

    return (
        <Box>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                }}>
                    <Box display="flex" alignItems="center" gap={3} mb={3}>
                        <Box position="relative">
                            <Avatar 
                                src={user.image || undefined}
                                sx={{ 
                                    width: 100, 
                                    height: 100, 
                                    bgcolor: 'primary.main',
                                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                                    border: '4px solid #fff'
                                }}
                            >
                                {!user.image && <PersonIcon sx={{ fontSize: 50 }} />}
                            </Avatar>
                            <label htmlFor="icon-button-file">
                                <Input accept="image/*" id="icon-button-file" type="file" onChange={handleImageUpload} />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        p: 1,
                                        display: 'flex',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <PhotoCameraIcon sx={{ color: 'white', fontSize: 18 }} />
                                </Box>
                            </label>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">{user.name}</Typography>
                            <Typography color="textSecondary">{user.email}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
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
                                    <Button onClick={handleUpdate} variant="contained" sx={{ borderRadius: 2 }}>Save Changes</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
                                        Name:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1">{user.name}</Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
                                        Email:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
                                        Member Since:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body1" suppressHydrationWarning>
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </Typography>
                                </Grid>

                            </Grid>

                            <Box mt={4} display="flex" justifyContent="flex-end">
                                <Button 
                                    onClick={() => setIsEditing(true)} 
                                    variant="contained" 
                                    sx={{ borderRadius: 2, px: 4 }}
                                >
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