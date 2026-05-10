import React, { useState, useEffect, useRef } from 'react'
import { Box, CircularProgress } from '@mui/material'

const CACHE_NAME = 'stock-images-v1'

const getCachedImage = async (url) => {
  try {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(url)
    if (cached) return cached
    const res = await fetch(url, { cache: 'force-cache' })
    if (res.ok) {
      const clone = res.clone()
      cache.put(url, clone).catch(() => {})
    }
    return res
  } catch {
    return null
  }
}

export const ImgCache = ({ src, alt, sx, ...props }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!src) { setLoading(false); return }
    let cancelled = false

    ;(async () => {
      try {
        const cached = await getCachedImage(src)
        if (cancelled || !mounted.current) return
        if (cached) {
          const blob = await cached.blob()
          const objectUrl = URL.createObjectURL(blob)
          setImgSrc(objectUrl)
          setLoading(false)
        } else {
          setImgSrc(src)
          setLoading(false)
        }
      } catch {
        if (!cancelled && mounted.current) {
          setImgSrc(src)
          setLoading(false)
        }
      }
    })()

    return () => { cancelled = true }
  }, [src])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', ...sx }}>
        <CircularProgress size={20} />
      </Box>
    )
  }

  if (!imgSrc) return null

  return <Box component="img" src={imgSrc} alt={alt || ''} sx={sx} {...props} />
}
