import React, { useState } from 'react'
import { Box, Typography, Avatar, IconButton, CircularProgress } from '@mui/material'
import { CameraAlt, Delete } from '@mui/icons-material'
import { storage } from '../services/firebase'

export const ImageUpload = ({ uid, path, currentImage, onImageChange, size = 120 }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)

  const handleUpload = async (file) => {
    if (!file || !uid) return
    setUploading(true)
    try {
      const ref = storage().ref(`${uid}/${path}/${Date.now()}_${file.name}`)
      const snapshot = await ref.put(file)
      const url = await snapshot.ref.getDownloadURL()
      setPreview(url)
      onImageChange(url)
    } catch (err) {
      console.error('Upload error:', err)
    }
    setUploading(false)
  }

  const handleDelete = () => {
    setPreview(null)
    onImageChange(null)
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <Avatar
          src={preview || undefined}
          sx={{ width: size, height: size, borderRadius: 2, bgcolor: 'action.hover', fontSize: 40 }}
        >
          {!preview && '📷'}
        </Avatar>
        {uploading && (
          <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: -1.5, ml: -1.5 }} />
        )}
        <IconButton
          component="label"
          size="small"
          sx={{ position: 'absolute', bottom: -4, right: -4, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'action.hover' } }}
        >
          <CameraAlt fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} />
        </IconButton>
        {preview && (
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{ position: 'absolute', top: -6, right: -6, bgcolor: 'error.main', color: '#fff', width: 22, height: 22, '&:hover': { bgcolor: 'error.dark' } }}
          >
            <Delete sx={{ fontSize: 14 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}
