import React, { useState } from 'react'
import {
  Box, TextField, Button, Typography, Alert, Divider,
  CircularProgress, Grow, Avatar
} from '@mui/material'
import { LockOutlined, Google as GoogleIcon } from '@mui/icons-material'
import { signIn, signInWithGoogle, sendPasswordReset } from '../services/auth'
import logo from '../images/logo.png'

export const FormSignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completá todos los campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
    } catch (err) {
      setError(getErrorMessage(err.code))
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getErrorMessage(err.code))
      }
    }
    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) {
      setError('Ingresá tu correo para recuperar la contraseña')
      return
    }
    setLoading(true)
    setError('')
    try {
      await sendPasswordReset(email)
      setEmailSent(true)
    } catch {
      setError('Error al enviar el correo')
    }
    setLoading(false)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', py: 4, px: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img src={logo} alt="Logo" style={{ maxWidth: 200, marginBottom: 16 }} />
            <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.dark' }}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5" fontWeight={700}>
              {resetMode ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {emailSent && (
            <Grow in>
              <Alert severity="success" sx={{ mb: 2 }}>
                Revisá tu casilla de correo para generar una nueva clave
              </Alert>
            </Grow>
          )}

          {!resetMode ? (
            <>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{ mb: 1 }}
              >
                Ingresar
              </Button>
              <Divider sx={{ my: 2 }}>o</Divider>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogle}
              >
                Ingresar con Google
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => { setResetMode(true); setError('') }}
                >
                  Recuperar Contraseña
                </Button>
              </Box>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleReset}
                sx={{ mb: 1 }}
              >
                Enviar mail de recuperación
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => { setResetMode(false); setError('') }}
                >
                  Volver al inicio de sesión
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}

function getErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Demasiados intentos. Probá más tarde',
    'auth/popup-closed-by-user': 'Ventana cerrada',
  }
  return messages[code] || 'Ocurrió un error'
}
