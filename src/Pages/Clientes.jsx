import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { 
    Paper, Grid, Typography, TextField, IconButton, Button, 
    Table, TableHead, TableBody, TableRow, TableCell, Chip, 
    Card, CardContent, Tooltip, Divider, Avatar, InputAdornment,
    MenuItem, Menu, ListItemIcon, ListItemText, Tab, Tabs,
    FormControl, InputLabel, Select
} from '@mui/material'
import { 
    PersonAdd, Search, AttachMoney, Phone, Email, FilterList,
    ArrowUpward, ArrowDownward, History, AccountBalanceWallet,
    Settings, Delete, Edit, LocalShipping, AssignmentTurnedIn,
    SortByAlpha, Warning, Star, StarBorder, CheckCircle
} from '@mui/icons-material'
import { Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'
import { content } from './styles/styles'
import Empty from '../images/Empty.png'

// COMPONENT
const Clientes = (props) => {
    const classes = content()
    const [search, setSearch] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [ordenamiento, setOrdenamiento] = useState('nombre-asc')
    const [tabValue, setTabValue] = useState(0)
    const [anchorElFiltro, setAnchorElFiltro] = useState(null)
    const [clientesFavoritos, setClientesFavoritos] = useState([])
    
    // Obtener estadÃ­sticas de clientes
    const obtenerEstadisticas = () => {
        if (!props.clientes) return { total: 0, activos: 0, deudaTotal: 0 }
        
        let activos = 0
        let deudaTotal = 0
        let clientesConPedidos = 0
        
        Object.values(props.clientes).forEach(cliente => {
            if (cliente.datos.deuda > 0) {
                deudaTotal += cliente.datos.deuda
            }
            
            if (cliente.pedidos && Object.keys(cliente.pedidos).length > 0) {
                clientesConPedidos++
                activos++
            }
        })
        
        return {
            total: Object.keys(props.clientes).length,
            activos,
            deudaTotal,
            clientesConPedidos
        }
    }
    
    // Calcular clientes favoritos basado en volumen de pedidos
    useEffect(() => {
        if (props.clientes) {
            const favoritos = Object.keys(props.clientes)
                .map(key => ({
                    nombre: key,
                    datos: props.clientes[key].datos,
                    pedidos: props.clientes[key].pedidos ? Object.keys(props.clientes[key].pedidos).length : 0
                }))
                .sort((a, b) => b.pedidos - a.pedidos)
                .slice(0, 5);
                
            setClientesFavoritos(favoritos);
        }
    }, [props.clientes]);
    
    // Filtrar clientes
    const filtrarClientes = () => {
        if (!props.clientes) return [];
        
        return Object.keys(props.clientes)
            .filter(key => {
                const cliente = props.clientes[key];
                
                // Filtrar por bÃºsqueda
                if (search && !key.toLowerCase().includes(search.toLowerCase()) && 
                   (!cliente.datos.telefono || !cliente.datos.telefono.includes(search)) &&
                   (!cliente.datos.email || !cliente.datos.email.toLowerCase().includes(search.toLowerCase()))) {
                    return false;
                }
                
                // Filtrar por tab seleccionado
                if (tabValue === 1 && (!cliente.datos.deuda || cliente.datos.deuda <= 0)) {
                    return false;
                }
                
                if (tabValue === 2 && (!cliente.pedidos || Object.keys(cliente.pedidos).length === 0)) {
                    return false;
                }
                
                // Filtros adicionales
                switch (filtro) {
                    case 'con-deuda':
                        return cliente.datos.deuda > 0;
                    case 'sin-deuda':
                        return !cliente.datos.deuda || cliente.datos.deuda <= 0;
                    case 'con-pedidos':
                        return cliente.pedidos && Object.keys(cliente.pedidos).length > 0;
                    case 'sin-pedidos':
                        return !cliente.pedidos || Object.keys(cliente.pedidos).length === 0;
                    default:
                        return true;
                }
            })
            .map(key => ({
                nombre: key,
                datos: props.clientes[key].datos,
                pedidos: props.clientes[key].pedidos ? Object.keys(props.clientes[key].pedidos).length : 0
            }))
            .sort((a, b) => {
                // Ordenamiento
                switch (ordenamiento) {
                    case 'nombre-asc':
                        return a.nombre.localeCompare(b.nombre);
                    case 'nombre-desc':
                        return b.nombre.localeCompare(a.nombre);
                    case 'deuda-asc':
                        return (a.datos.deuda || 0) - (b.datos.deuda || 0);
                    case 'deuda-desc':
                        return (b.datos.deuda || 0) - (a.datos.deuda || 0);
                    case 'pedidos-asc':
                        return a.pedidos - b.pedidos;
                    case 'pedidos-desc':
                        return b.pedidos - a.pedidos;
                    default:
                        return 0;
                }
            });
    }
    
    const estadisticas = obtenerEstadisticas();
    const clientesFiltrados = filtrarClientes();
    
    // Manejadores de eventos
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    
    const handleMenuFiltro = (event) => {
        setAnchorElFiltro(event.currentTarget);
    };
    
    const handleCloseFiltro = () => {
        setAnchorElFiltro(null);
    };
    
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };
    
    const getColorForDeuda = (deuda) => {
        if (!deuda || deuda <= 0) return '#4caf50';  // Verde
        if (deuda < 50000) return '#ff9800';         // Amarillo
        return '#f44336';                            // Rojo
    };
    
    // Generar Avatar con color basado en la primera letra del nombre
    const getColorFromName = (name) => {
        const colors = [
            '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', 
            '#c2185b', '#0097a7', '#fbc02d', '#455a64'
        ];
        const charCode = name.charCodeAt(0);
        return colors[charCode % colors.length];
    };
    
    return (
        <Layout history={props.history} page="Clientes" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* HEADER - ESTADÃSTICAS */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <Card className={classes.cardEstadistica}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total de Clientes
                                </Typography>
                                <Typography variant="h3">
                                    {estadisticas.total}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card className={classes.cardEstadistica}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Clientes Activos
                                </Typography>
                                <Typography variant="h3">
                                    {estadisticas.activos}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {estadisticas.total > 0 ? `${Math.round((estadisticas.activos / estadisticas.total) * 100)}% del total` : '0%'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card className={classes.cardEstadistica}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Deuda Total
                                </Typography>
                                <Typography variant="h4">
                                    ${formatMoney(estadisticas.deudaTotal)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card className={classes.cardEstadistica}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Acciones RÃ¡pidas
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Tooltip title="Nuevo Cliente">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                to="/Nuevo-Cliente"
                                                startIcon={<PersonAdd />}
                                            >
                                                Nuevo
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Cobrar Deudas">
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                component={Link}
                                                to="/Deudas"
                                                startIcon={<AttachMoney />}
                                            >
                                                Cobrar
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                
                {/* BARRA DE BÃšSQUEDA Y FILTROS */}
                <Grid container spacing={2} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            disabled={!props.clientes}
                            label="Buscar Cliente"
                            variant="outlined"
                            placeholder="Nombre, telÃ©fono o email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Ordenar por</InputLabel>
                            <Select
                                value={ordenamiento}
                                onChange={(e) => setOrdenamiento(e.target.value)}
                                label="Ordenar por"
                            >
                                <MenuItem value="nombre-asc">Nombre (A-Z)</MenuItem>
                                <MenuItem value="nombre-desc">Nombre (Z-A)</MenuItem>
                                <MenuItem value="deuda-desc">Mayor Deuda</MenuItem>
                                <MenuItem value="deuda-asc">Menor Deuda</MenuItem>
                                <MenuItem value="pedidos-desc">Mayor Actividad</MenuItem>
                                <MenuItem value="pedidos-asc">Menor Actividad</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            style={{ height: '100%' }}
                            startIcon={<FilterList />}
                            onClick={handleMenuFiltro}
                        >
                            Filtros Avanzados
                        </Button>
                        <Menu
                            anchorEl={anchorElFiltro}
                            keepMounted
                            open={Boolean(anchorElFiltro)}
                            onClose={handleCloseFiltro}
                        >
                            <MenuItem 
                                onClick={() => { setFiltro('todos'); handleCloseFiltro(); }}
                                selected={filtro === 'todos'}
                            >
                                <ListItemIcon>
                                    <FilterList fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Todos los clientes" />
                            </MenuItem>
                            <MenuItem 
                                onClick={() => { setFiltro('con-deuda'); handleCloseFiltro(); }}
                                selected={filtro === 'con-deuda'}
                            >
                                <ListItemIcon>
                                    <Warning fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Con deuda pendiente" />
                            </MenuItem>
                            <MenuItem 
                                onClick={() => { setFiltro('sin-deuda'); handleCloseFiltro(); }}
                                selected={filtro === 'sin-deuda'}
                            >
                                <ListItemIcon>
                                    <CheckCircle fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Sin deuda pendiente" />
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                                onClick={() => { setFiltro('con-pedidos'); handleCloseFiltro(); }}
                                selected={filtro === 'con-pedidos'}
                            >
                                <ListItemIcon>
                                    <LocalShipping fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Con pedidos realizados" />
                            </MenuItem>
                            <MenuItem 
                                onClick={() => { setFiltro('sin-pedidos'); handleCloseFiltro(); }}
                                selected={filtro === 'sin-pedidos'}
                            >
                                <ListItemIcon>
                                    <AssignmentTurnedIn fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Sin pedidos realizados" />
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
                
                {/* TABS */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="filtro clientes"
                >
                    <Tab label="Todos" />
                    <Tab label="Con Deuda" />
                    <Tab label="Con Pedidos" />
                </Tabs>
                
                {/* CLIENTES FAVORITOS */}
                {clientesFavoritos.length > 0 && (
                    <div style={{ marginTop: 16, marginBottom: 16 }}>
                        <Typography variant="h6" gutterBottom>
                            Clientes Destacados
                        </Typography>
                        <Grid container spacing={2}>
                            {clientesFavoritos.map((cliente, index) => (
                                <Grid item xs={6} sm={4} md={2} key={cliente.nombre}>
                                    <Card 
                                        component={Link}
                                        to={`/Cliente?${cliente.nombre}`}
                                        style={{ 
                                            textDecoration: 'none',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 16,
                                            position: 'relative'
                                        }}
                                    >
                                        <Star style={{ 
                                            position: 'absolute', 
                                            top: 8, 
                                            right: 8, 
                                            color: index === 0 ? '#ffd700' : '#bdbdbd' 
                                        }} />
                                        <Avatar 
                                            style={{ 
                                                backgroundColor: getColorFromName(cliente.nombre),
                                                width: 60,
                                                height: 60,
                                                marginBottom: 8
                                            }}
                                        >
                                            {getInitials(cliente.nombre)}
                                        </Avatar>
                                        <Typography 
                                            variant="subtitle1" 
                                            style={{ 
                                                textAlign: 'center',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                width: '100%'
                                            }}
                                        >
                                            {cliente.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {cliente.pedidos} pedidos
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}
                
                {/* LISTA DE CLIENTES */}
                <Paper elevation={3} style={{ marginTop: 16, overflowX: 'auto' }}>
                    {props.clientes && clientesFiltrados.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#01579b' }}>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Contacto</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="right">Deuda</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="center">Pedidos</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clientesFiltrados.map(cliente => (
                                    <TableRow 
                                        key={cliente.nombre}
                                        hover
                                        style={{ 
                                            borderLeft: `4px solid ${getColorForDeuda(cliente.datos.deuda)}`,
                                            cursor: 'pointer' 
                                        }}
                                        onClick={() => props.history.push(`/Cliente?${cliente.nombre}`)}
                                    >
                                        <TableCell>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar style={{ backgroundColor: getColorFromName(cliente.nombre) }}>
                                                        {getInitials(cliente.nombre)}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1">
                                                        {cliente.nombre}
                                                    </Typography>
                                                    {cliente.datos.direccion && (
                                                        <Typography variant="caption" color="textSecondary">
                                                            {cliente.datos.direccion}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>
                                            {cliente.datos.telefono && (
                                                <Typography variant="body2">
                                                    <Phone fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                    {cliente.datos.telefono}
                                                </Typography>
                                            )}
                                            {cliente.datos.email && (
                                                <Typography variant="body2">
                                                    <Email fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                    {cliente.datos.email}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography 
                                                variant="subtitle1" 
                                                style={{ 
                                                    color: getColorForDeuda(cliente.datos.deuda),
                                                    fontWeight: cliente.datos.deuda > 0 ? 'bold' : 'normal'
                                                }}
                                            >
                                                ${formatMoney(cliente.datos.deuda || 0)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={cliente.pedidos}
                                                color={cliente.pedidos > 0 ? "primary" : "default"}
                                                variant={cliente.pedidos > 0 ? "default" : "outlined"}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Ver Perfil">
                                                <IconButton 
                                                    component={Link}
                                                    to={`/Cliente?${cliente.nombre}`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Settings fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Ver Historial">
                                                <IconButton 
                                                    component={Link}
                                                    to={`/Historial-Cliente?${cliente.nombre}`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <History fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Pagos y Deudas">
                                                <IconButton 
                                                    component={Link}
                                                    to={`/Nuevo-Pago-Cliente?${cliente.nombre}`}
                                                    size="small"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <AccountBalanceWallet fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <img src={Empty} alt="" style={{ height: '250px', marginBottom: '24px' }} />
                            <Typography variant="h5" gutterBottom>
                                No hay clientes para mostrar
                            </Typography>
                            <Typography variant="body1" color="textSecondary" paragraph>
                                {props.clientes ? 'No se encontraron clientes con los filtros actuales' : 'No hay clientes ingresados en el sistema'}
                            </Typography>
                            {!props.clientes && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/Nuevo-Cliente"
                                    startIcon={<PersonAdd />}
                                    style={{ marginTop: 16 }}
                                >
                                    Agregar Primer Cliente
                                </Button>
                            )}
                        </div>
                    )}
                </Paper>
                
                {/* RESUMEN DE FILTROS APLICADOS */}
                {props.clientes && clientesFiltrados.length > 0 && (
                    <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: 16 }}>
                        <Grid item>
                            <Typography variant="body2" color="textSecondary">
                                Mostrando {clientesFiltrados.length} de {estadisticas.total} clientes
                            </Typography>
                        </Grid>
                        <Grid item>
                            {filtro !== 'todos' && (
                                <Chip 
                                    label={`Filtro: ${filtro.replace(/-/g, ' ')}`}
                                    onDelete={() => setFiltro('todos')}
                                    color="primary" 
                                    variant="outlined"
                                    style={{ marginRight: 8 }}
                                />
                            )}
                            {search && (
                                <Chip 
                                    label={`BÃºsqueda: ${search}`}
                                    onDelete={() => setSearch('')}
                                    color="primary"
                                    variant="outlined" 
                                />
                            )}
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Layout>
    )
}

export default withStore(Clientes)
