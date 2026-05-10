import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography } from '@mui/material'
import { Search, PersonAdd } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardProveedor } from '../components/Proveedores/CardProveedor'

const Proveedores = (props) => {
  const [search, setSearch] = useState('')

  return (
    <Layout history={props.history} page="Proveedores" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            }}
            sx={{ maxWidth: 400 }}
          />
          <IconButton component={Link} to="/Nuevo-Proveedor" color="primary">
            <PersonAdd />
          </IconButton>
        </Box>

        {props.proveedores ? (
          <Grid container spacing={2}>
            {Object.keys(props.proveedores).map((key) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <CardProveedor datos={props.proveedores[key].datos} search={search} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay proveedores todavía.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(Proveedores)
