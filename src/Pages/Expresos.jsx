import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography, Card, CardContent, Button } from '@mui/material'
import { Search, Add, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardExpreso } from '../components/Expresos/CardExpreso'

const Expresos = (props) => {
  const [search, setSearch] = useState('')
  const expresos = props.expresos ? Object.entries(props.expresos) : []

  return (
    <Layout history={props.history} page="Expresos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button component={Link} to="/Nuevo-Expreso" variant="contained" startIcon={<Add />}>Nuevo Transporte</Button>
          <TextField fullWidth size="small" placeholder="Buscar transporte..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
        </Box>

        {expresos.length > 0 ? (
          <Grid container spacing={2}>
            {expresos.map(([key, e]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <CardExpreso datos={e.datos} search={search} pushKey={key} />
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
