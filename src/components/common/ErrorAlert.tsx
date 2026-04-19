import { Alert, AlertColor, Snackbar } from '@mui/material'

interface ErrorAlertProps {
    open: boolean
    message: string
    severity?: AlertColor
    onClose: () => void
}

export default function ErrorAlert({ open, message, severity = 'error', onClose }: ErrorAlertProps) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}