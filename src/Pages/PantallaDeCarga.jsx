import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { keyframes } from '@mui/material/styles'

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 1; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const dots = keyframes`
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  80%, 100% { opacity: 0; }
`

const messages = [
  'Cargando datos...',
  'Conectando con Firebase...',
  'Sincronizando productos...',
  'Cargando clientes...',
  'Preparando todo...',
]

export const PantallaDeCarga = () => {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', gap: 3 }}>
      {/* Spinning circle */}
      <Box sx={{ position: 'relative', width: 72, height: 72 }}>
        <Box sx={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid', borderColor: 'divider',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'primary.main',
          animation: `${spin} 0.8s linear infinite`,
        }} />
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main',
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }} />
      </Box>

      {/* App name */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} letterSpacing={1}>
          CENTRAL DE STOCK
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {messages[msgIndex]}
          <Box component="span" sx={{ display: 'inline-flex', ml: 0.5 }}>
            <Box component="span" sx={{ animation: `${dots} 1.4s infinite`, animationDelay: '0s' }}>.</Box>
            <Box component="span" sx={{ animation: `${dots} 1.4s infinite`, animationDelay: '0.2s' }}>.</Box>
            <Box component="span" sx={{ animation: `${dots} 1.4s infinite`, animationDelay: '0.4s' }}>.</Box>
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}
