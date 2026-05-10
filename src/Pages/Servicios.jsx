import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Layout } from './Layout'
import { 
    Typography, Backdrop, Grid, CircularProgress, Snackbar, Paper, 
    FormControl, InputLabel, Select, MenuItem, Button, IconButton, Tabs, Tab, Table, TableHead, TableBody, TableRow, TableCell, Chip, ButtonGroup, Tooltip, TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Switch, FormControlLabel
} from '@mui/material'
import { Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { content } from './styles/styles'
import AddIcon from '@mui/icons-material/Add'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import { CardServicio } from '../components/Servicios/CardServicio'
import { formatMoney, obtenerFecha } from '../utilities'
import { FilterList, Category, Receipt, AttachMoney, Edit, Delete, Info, Search } from '@mui/icons-material'
import { CalendarToday } from '@mui/icons-material'

// COMPONENT
const Servicios = (props) => {
    const classes = content()
    const [showSnackbar, setShowSnackbar] = useState('')
    const [loading, setLoading] = useState(false)
    const [filtroCategoria, setFiltroCategoria] = useState('todas')
    const [tabValue, setTabValue] = useState(0)
    
    // Control de fecha para navegar entre meses
    const fechaActual = new Date()
    const [mesSeleccionado, setMesSeleccionado] = useState(fechaActual.getMonth())
    const [anioSeleccionado, setAnioSeleccionado] = useState(fechaActual.getFullYear())
    
    // Estado para el diÃ¡logo de recibir boleta
    const [dialogoRecibirBoleta, setDialogoRecibirBoleta] = useState(false)
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
    const [montoBoleta, setMontoBoleta] = useState('')
    const [fechaVencimiento, setFechaVencimiento] = useState('')
    
    // FunciÃ³n para cambiar de mes
    const cambiarMes = (incremento) => {
        let nuevoMes = mesSeleccionado + incremento
        let nuevoAnio = anioSeleccionado
        
        if (nuevoMes > 11) {
            nuevoMes = 0
            nuevoAnio += 1
        } else if (nuevoMes < 0) {
            nuevoMes = 11
            nuevoAnio -= 1
        }
        
        setMesSeleccionado(nuevoMes)
        setAnioSeleccionado(nuevoAnio)
    }
    
    // Obtener nombre del mes
    const getNombreMes = (mes) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return meses[mes]
    }
    
    // Cambiar pestaÃ±a
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    
    // FunciÃ³n para eliminar un servicio
    const eliminarServicio = (id) => {
        setLoading(true)
        database().ref().child(props.user.uid).child('servicios').child(id).remove()
            .then(() => {
                setShowSnackbar('El servicio se eliminÃ³ correctamente')
                setTimeout(() => {
                    setLoading(false)
                    setShowSnackbar('')
                }, 2000)
            })
            .catch(() => {
                setLoading(false)
                setShowSnackbar('Error al eliminar el servicio')
            })
    }
    
    const [searchTerm, setSearchTerm] = useState('')
    
    // Filtrar servicios por categorÃ­a, estado y tÃ©rmino de bÃºsqueda
    const filtrarServicios = () => {
        if (!props.servicios) return []
        
        const idPeriodo = `${anioSeleccionado}-${mesSeleccionado + 1}`
        const serviciosFiltrados = Object.keys(props.servicios)
            .filter(key => {
                const servicio = props.servicios[key]
                
                // Filtrar por tÃ©rmino de bÃºsqueda si existe
                if (searchTerm && 
                    !servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    !servicio.categoria?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false
                }
                
                // Filtrar por categorÃ­a si no es "todas"
                if (filtroCategoria !== 'todas' && servicio.categoria !== filtroCategoria) {
                    return false
                }
                
                // Filtrar segÃºn la frecuencia del servicio
                if (servicio.frecuencia === 'anual' && servicio.mesPago !== (mesSeleccionado + 1)) {
                    return false
                }
                
                if (servicio.frecuencia === 'personalizado' && 
                    servicio.mesesPago && 
                    !servicio.mesesPago.includes(mesSeleccionado + 1)) {
                    return false
                }
                
                // Filtrar segÃºn la pestaÃ±a seleccionada
                const instancia = props.instanciasPago && 
                                props.instanciasPago[idPeriodo] && 
                                props.instanciasPago[idPeriodo][key]
                
                if (tabValue === 0) { // Todos
                    return true
                } else if (tabValue === 1) { // Pagados
                    return instancia && instancia.estado === 'pagado'
                } else if (tabValue === 2) { // Pendientes
                    return instancia && instancia.estado === 'pendiente'
                } else if (tabValue === 3) { // Sin boleta
                    return !instancia || instancia.estado === 'sin_boleta'
                }
                
                return true
            })
            .map(key => ({ id: key, ...props.servicios[key] }))
        
        return serviciosFiltrados
    }
    
    // Obtener todas las categorÃ­as para el filtro
    const obtenerCategorias = () => {
        if (!props.servicios) return []
        
        const categorias = new Set()
        Object.values(props.servicios).forEach(servicio => {
            if (servicio.categoria) {
                categorias.add(servicio.categoria)
            }
        })
        
        return Array.from(categorias)
    }
    
    // Calcular total por estado
    const calcularTotales = () => {
        if (!props.servicios || !props.instanciasPago) return { pagado: 0, pendiente: 0, total: 0 }
        
        const idPeriodo = `${anioSeleccionado}-${mesSeleccionado + 1}`
        let totalPagado = 0
        let totalPendiente = 0
        
        if (props.instanciasPago[idPeriodo]) {
            Object.entries(props.instanciasPago[idPeriodo]).forEach(([servicioId, instancia]) => {
                if (filtroCategoria === 'todas' || props.servicios[servicioId]?.categoria === filtroCategoria) {
                    if (instancia.estado === 'pagado') {
                        totalPagado += instancia.monto || 0
                    } else if (instancia.estado === 'pendiente') {
                        totalPendiente += instancia.monto || 0
                    }
                }
            })
        }
        
        return {
            pagado: totalPagado,
            pendiente: totalPendiente,
            total: totalPagado + totalPendiente
        }
    }
    
    const totales = calcularTotales()
    const serviciosFiltrados = filtrarServicios()
    
    // Abrir diÃ¡logo para recibir boleta
    const abrirDialogoRecibirBoleta = (servicio) => {
        setServicioSeleccionado(servicio)
        setMontoBoleta('')
        setFechaVencimiento('')
        setDialogoRecibirBoleta(true)
    }
    
    // Cerrar diÃ¡logo
    const cerrarDialogoRecibirBoleta = () => {
        setDialogoRecibirBoleta(false)
        setServicioSeleccionado(null)
    }
    
    // Guardar boleta desde el diÃ¡logo
    const guardarBoleta = async () => {
        // Validar datos
        if (!montoBoleta || isNaN(montoBoleta) || parseFloat(montoBoleta) <= 0) {
            setShowSnackbar('Ingrese un monto vÃ¡lido')
            return
        }
        
        if (!fechaVencimiento) {
            setShowSnackbar('Ingrese una fecha de vencimiento')
            return
        }
        
        if (!servicioSeleccionado) {
            setShowSnackbar('No se ha seleccionado un servicio')
            return
        }
        
        setLoading(true)
        try {
            const idPeriodo = `${anioSeleccionado}-${mesSeleccionado + 1}`
            
            // Crear datos de la boleta
            const boletaData = {
                monto: parseFloat(montoBoleta),
                vencimiento: fechaVencimiento,
                estado: 'pendiente',
                fechaRecepcion: obtenerFecha()
            }
            
            
            // Guardar en Firebase
            await database().ref().child(props.user.uid).child('instanciasPago').child(idPeriodo).child(servicioSeleccionado.id).set(boletaData)
            
            setShowSnackbar('La boleta se registrÃ³ correctamente')
            setTimeout(() => {
                setLoading(false)
                cerrarDialogoRecibirBoleta()
            }, 2000)
        } catch (error) {
            setLoading(false)
            setShowSnackbar(`Error: ${error.message}`)
        }
    }
    
    return (
        <Layout history={props.history} page="Servicios" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* FILTROS Y NAVEGACIÃ“N */}
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                            <InputLabel>Filtrar por CategorÃ­a</InputLabel>
                            <Select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                label="Filtrar por CategorÃ­a"
                            >
                                <MenuItem value="todas">Todas las CategorÃ­as</MenuItem>
                                {obtenerCategorias().map(categoria => (
                                    <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={4} container justify="center" alignItems="center">
                        <IconButton onClick={() => cambiarMes(-1)}>
                            <NavigateBeforeIcon />
                        </IconButton>
                        <Typography variant="h6">
                            {getNombreMes(mesSeleccionado)} {anioSeleccionado}
                        </Typography>
                        <IconButton onClick={() => cambiarMes(1)}>
                            <NavigateNextIcon />
                        </IconButton>
                    </Grid>
                    
                    <Grid item xs={12} sm={4} container justify="flex-end">
                        <Link 
                            to="/Nuevo-Servicio"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                            >
                                Nuevo Servicio
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                
                {/* RESUMEN DEL MES - VERSIÃ“N MEJORADA */}
                <Grid container spacing={3} style={{ margin: '20px 0' }}>
                    {/* TARJETA TOTAL PAGADO */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} style={{ 
                            padding: '20px', 
                            height: '100%',
                            background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="body2" style={{ opacity: 0.9 }}>
                                        TOTAL PAGADO
                                    </Typography>
                                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                        ${formatMoney(totales.pagado)}
                                    </Typography>
                                    {totales.total > 0 && (
                                        <Typography variant="body2" style={{ marginTop: '8px', opacity: 0.9 }}>
                                            {Math.round((totales.pagado / totales.total) * 100)}% del total
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <div style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        borderRadius: '50%',
                                        padding: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <AttachMoney style={{ fontSize: 40 }} />
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* TARJETA TOTAL PENDIENTE */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} style={{ 
                            padding: '20px', 
                            height: '100%',
                            background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="body2" style={{ opacity: 0.9 }}>
                                        TOTAL PENDIENTE
                                    </Typography>
                                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                        ${formatMoney(totales.pendiente)}
                                    </Typography>
                                    {totales.total > 0 && (
                                        <Typography variant="body2" style={{ marginTop: '8px', opacity: 0.9 }}>
                                            {Math.round((totales.pendiente / totales.total) * 100)}% del total
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <div style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        borderRadius: '50%',
                                        padding: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Receipt style={{ fontSize: 40 }} />
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* TARJETA TOTAL DEL MES */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} style={{ 
                            padding: '20px', 
                            height: '100%',
                            background: 'linear-gradient(135deg, #01579b 0%, #0277bd 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)'
                            }
                        }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="body2" style={{ opacity: 0.9 }}>
                                        TOTAL DEL MES
                                    </Typography>
                                    <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                        ${formatMoney(totales.total)}
                                    </Typography>
                                    <Typography variant="body2" style={{ marginTop: '8px', opacity: 0.9 }}>
                                        {serviciosFiltrados.length} servicios
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <div style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        borderRadius: '50%',
                                        padding: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CalendarToday style={{ fontSize: 40 }} />
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                
                {/* BARRA DE BÃšSQUEDA */}
                <Grid container spacing={2} style={{ marginTop: '40px', marginBottom: '20px' }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Buscar servicio"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
                
                {/* PESTAÃ‘AS */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="filtro servicios"
                >
                    <Tab label="Todos" />
                    <Tab label="Pagados" />
                    <Tab label="Pendientes" />
                    <Tab label="Sin Boleta" />
                </Tabs>
                
                {/* LISTADO DE SERVICIOS */}
                <Paper elevation={3} style={{ marginTop: '20px', overflowX: 'auto' }}>
                    {serviciosFiltrados.length > 0 ? (
                        <Table aria-label="tabla de servicios">
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#01579b' }}>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="center">Monto</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Vencimiento</TableCell>
                                    <TableCell style={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviciosFiltrados.map(servicio => {
                                    // Obtener la instancia actual del servicio para este mes/aÃ±o
                                    const instancia = props.instanciasPago && 
                                                    props.instanciasPago[`${anioSeleccionado}-${mesSeleccionado + 1}`] && 
                                                    props.instanciasPago[`${anioSeleccionado}-${mesSeleccionado + 1}`][servicio.id];
                                    
                                    // Determinar colores segÃºn el estado
                                    let estadoColor, estadoTexto;
                                    if (!instancia) {
                                        estadoColor = "#9e9e9e";
                                        estadoTexto = "Sin boleta";
                                    } else if (instancia.estado === 'pagado') {
                                        estadoColor = "#2e7d32";
                                        estadoTexto = "Pagado";
                                    } else {
                                        estadoColor = "#c62828";
                                        estadoTexto = "Pendiente";
                                    }
                                    
                                    return (
                                        <TableRow key={servicio.id} hover 
                                            style={{ 
                                                borderLeft: `4px solid ${estadoColor}`,
                                            }}
                                        >
                                            {/* ESTADO */}
                                            <TableCell>
                                                <Chip 
                                                    label={estadoTexto}
                                                    style={{ 
                                                        backgroundColor: estadoColor,
                                                        color: 'white'
                                                    }}
                                                    size="small"
                                                />
                                            </TableCell>
                                            
                                            {/* NOMBRE */}
                                            <TableCell>
                                                <Typography variant="subtitle1" style={{ fontWeight: 'medium' }}>
                                                    {servicio.nombre}
                                                </Typography>
                                                {servicio.nota && (
                                                    <Typography variant="caption" color="textSecondary" style={{ display: 'block' }}>
                                                        {servicio.nota}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            
                                            
                                            {/* MONTO */}
                                            <TableCell align="right">
                                                {instancia ? 
                                                    <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                                        ${formatMoney(instancia.monto || 0)}
                                                    </Typography> : 
                                                    <Typography variant="body2" color="textSecondary">
                                                        --
                                                    </Typography>
                                                }
                                            </TableCell>
                                            
                                            {/* VENCIMIENTO */}
                                            <TableCell align='center'>
                                                {instancia && instancia.vencimiento ? 
                                                    <Chip
                                                        icon={<CalendarToday fontSize="small" />}
                                                        label={instancia.vencimiento}
                                                        size="small"
                                                        variant="outlined"
                                                    /> : 
                                                    <Typography variant="body2" color="textSecondary">
                                                        --
                                                    </Typography>
                                                }
                                            </TableCell>
                                            
                                            {/* ACCIONES */}
                                            <TableCell align="center">
                                                <ButtonGroup size="small" aria-label="acciones servicio">
                                                    {/* RECIBIR BOLETA */}
                                                    {!instancia && (
                                                        <Tooltip title="Recibir Boleta">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary"
                                                                onClick={() => abrirDialogoRecibirBoleta(servicio)}
                                                            >
                                                                <Receipt fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    
                                                    {/* PAGAR SERVICIO */}
                                                    {instancia && instancia.estado === 'pendiente' && (
                                                        <Tooltip title="Pagar">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary"
                                                                component={Link}
                                                                to={{
                                                                    pathname: '/Pagar-Servicios',
                                                                    search: `?servicio=${servicio.id}&periodo=${anioSeleccionado}-${mesSeleccionado + 1}`
                                                                }}
                                                            >
                                                                <AttachMoney fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    
                                                    
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                No hay servicios para mostrar
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {filtroCategoria !== 'todas' ? 'Prueba cambiando el filtro de categorÃ­a' : 'Comienza agregando servicios'}
                            </Typography>
                        </div>
                    )}
                </Paper>
            </Paper>

            {/* BACKDROP & SNACKBAR */}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
                <Snackbar open={showSnackbar !== ''} autoHideDuration={2000} onClose={() => setShowSnackbar('')}>
                    <Alert severity="success" variant="filled">
                        {showSnackbar}
                    </Alert>
                </Snackbar>
            </Backdrop>
            
            {/* DIÃLOGO PARA RECIBIR BOLETA */}
            <Dialog 
                open={dialogoRecibirBoleta} 
                onClose={cerrarDialogoRecibirBoleta}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">
                    Recibir Boleta de {servicioSeleccionado ? servicioSeleccionado.nombre : ''}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ingrese los datos de la boleta para el perÃ­odo {mesSeleccionado !== undefined ? getNombreMes(mesSeleccionado) : ''} {anioSeleccionado}.
                    </DialogContentText>
                    
                    {servicioSeleccionado && (
                        <Grid container spacing={2} style={{marginTop: 10}}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    label="Monto"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={montoBoleta}
                                    onChange={(e) => setMontoBoleta(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Typography style={{ marginRight: 8 }}>$</Typography>
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Fecha de Vencimiento"
                                    variant="outlined"
                                    fullWidth
                                    type="date"
                                    value={fechaVencimiento}
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogoRecibirBoleta} color="default">
                        Cancelar
                    </Button>
                    <Button onClick={guardarBoleta} color="primary" variant="contained">
                        Guardar Boleta
                    </Button>
                </DialogActions>
            </Dialog>

            {/* BACKDROP */}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
                <Typography variant="h6" style={{ marginLeft: '16px', color: 'white' }}>
                    Guardando...
                </Typography>
            </Backdrop>
            
            {/* SNACKBAR */}
            <Snackbar open={showSnackbar !== ''} autoHideDuration={4000} onClose={() => setShowSnackbar('')}>
                <Alert 
                    severity={showSnackbar.includes('Error') ? 'error' : 'success'} 
                    variant="filled"
                    onClose={() => setShowSnackbar('')}
                >
                    {showSnackbar}
                </Alert>
            </Snackbar>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state => {
    return {
        user: state.user,
        servicios: state.servicios,
        instanciasPago: state.instanciasPago
    }
}

export default connect(mapStateToProps, null)(Servicios) 
