import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography } from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardExpreso } from '../components/Expresos/CardExpreso'

const Expresos = (props) => {
  const [search, setSearch] = useState('')
  return (
    <Layout history={props.history} page="Expresos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField fullWidth size="small" placeholder="Buscar transporte..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <IconButton component={Link} to="/Nuevo-Expreso" color="primary"><Add /></IconButton>
        </Box>
        {props.expresos ? (
          <Grid container spacing={2}>
            {Object.keys(props.expresos).map((key) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <CardExpreso datos={props.expresos[key].datos} search={search} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay transportes cargados.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(Expresos)
