'use client'

import { useState } from 'react'
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Chip,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    Tooltip,
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Today as TodayIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useTodos } from '@/hooks/useTodos'
import { formatDate, isOverdue } from '@/utils/helpers'
import Navbar from '@/components/layout/Navbar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'

interface User {
    id: number
    name: string
    email: string
    createdAt: string
}

interface Todo {
    id: number
    title: string
    description: string | null
    completed: boolean
    dueDate: string | null
    createdAt: string
}

interface DashboardClientProps {
    initialUser: User
    initialTodos: Todo[]
}

export default function DashboardClient({ initialUser, initialTodos }: DashboardClientProps) {
    const [openDialog, setOpenDialog] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: null as Date | null,
    })
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as const })

    const {
        todos,
        loading,
        error,
        addTodo,
        updateTodo,
        toggleComplete,
        deleteTodo,
    } = useTodos()

    const showAlert = (message: string, severity: 'success' | 'error' = 'success') => {
        setAlert({ open: true, message, severity })
    }

    const handleAddTodo = async () => {
        if (!formData.title.trim()) {
            showAlert('Please enter a title', 'error')
            return
        }

        try {
            await addTodo({
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate?.toISOString(),
            })
            showAlert('Todo added successfully')
            handleCloseDialog()
        } catch (err: any) {
            showAlert(err.message || 'Failed to add todo', 'error')
        }
    }

    const handleUpdateTodo = async () => {
        if (!editingTodo) return

        try {
            await updateTodo(editingTodo.id, {
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate?.toISOString(),
            })
            showAlert('Todo updated successfully')
            handleCloseDialog()
        } catch (err: any) {
            showAlert(err.message || 'Failed to update todo', 'error')
        }
    }

    const handleEditClick = (todo: Todo) => {
        setEditingTodo(todo)
        setFormData({
            title: todo.title,
            description: todo.description || '',
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        })
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingTodo(null)
        setFormData({
            title: '',
            description: '',
            dueDate: null,
        })
    }

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
    }

    if (loading) return <LoadingSpinner />

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1 }}>
                <Navbar />

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <ErrorAlert
                        open={!!error}
                        message={error || ''}
                        onClose={() => { }}
                    />

                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Tasks
                                    </Typography>
                                    <Typography variant="h3">{stats.total}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Completed
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {stats.completed}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Pending
                                    </Typography>
                                    <Typography variant="h3" color="warning.main">
                                        {stats.pending}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Todo List */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Your Tasks
                        </Typography>

                        {todos.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <Typography color="textSecondary">
                                    No tasks yet. Click the + button to add your first task!
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {todos.map((todo) => (
                                    <ListItem
                                        key={todo.id}
                                        divider
                                        sx={{
                                            bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                                            borderRadius: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Checkbox
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo.id, !todo.completed)}
                                            color="primary"
                                        />
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            textDecoration: todo.completed ? 'line-through' : 'none',
                                                            fontWeight: todo.completed ? 'normal' : 'bold',
                                                        }}
                                                    >
                                                        {todo.title}
                                                    </Typography>
                                                    {todo.dueDate && (
                                                        <Chip
                                                            size="small"
                                                            icon={<TodayIcon />}
                                                            label={formatDate(todo.dueDate)}
                                                            color={isOverdue(todo.dueDate) && !todo.completed ? 'error' : 'default'}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={todo.description}
                                        />
                                        <ListItemSecondaryAction>
                                            <Tooltip title="Edit">
                                                <IconButton edge="end" onClick={() => handleEditClick(todo)} sx={{ mr: 1 }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>

                    {/* Add Todo FAB */}
                    <Tooltip title="Add Todo">
                        <Fab
                            color="primary"
                            sx={{ position: 'fixed', bottom: 16, right: 16 }}
                            onClick={() => setOpenDialog(true)}
                        >
                            <AddIcon />
                        </Fab>
                    </Tooltip>

                    {/* Add/Edit Todo Dialog */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            {editingTodo ? 'Edit Todo' : 'Add New Todo'}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Title"
                                fullWidth
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <DatePicker
                                label="Due Date"
                                value={formData.dueDate}
                                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                                sx={{ mt: 2, width: '100%' }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={editingTodo ? handleUpdateTodo : handleAddTodo} variant="contained">
                                {editingTodo ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </LocalizationProvider>
    )
}