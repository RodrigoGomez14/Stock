import React, { useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

export const ImgCache = ({ src, alt, sx, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', ...sx }}>
        <Typography variant="h6" sx={{ opacity: 0.2 }}>📷</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...sx }}>
      {!loaded && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
          <CircularProgress size={16} />
        </Box>
      )}
      <Box
        component="img"
        src={src}
        alt={alt || ''}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        {...props}
      />
    </Box>
  )
}
