import React from 'react'
import { Grid, Paper, Box } from '@mui/material'
import { FormSignIn } from '../components/FormSignIn'
import foto from '../images/Valvulas.png'

export const SignInPage = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={5}
        md={7}
        sx={{
          display: { xs: 'none', sm: 'block' },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={foto}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(0.3) brightness(0.7)',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            bgcolor: 'transparent',
          }}
        >
          <FormSignIn />
        </Paper>
      </Grid>
    </Grid>
  )
}
