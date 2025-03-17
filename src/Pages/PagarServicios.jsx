import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Layout } from './Layout'
import { 
    Typography, Backdrop, Grid, CircularProgress, Snackbar, Paper, 
    Checkbox, Button, FormControlLabel, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, FormControl, 
    InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { database } from 'firebase'
import { content } from './styles/styles'
import { formatMoney, obtenerFecha } from '../utilities'
import { CalendarToday, AttachMoney, Delete } from '@material-ui/icons'

// COMPONENT
const PagarServicios = (props) => {
    const classes = content()
    const [showSnackbar, setShowSnackbar] = useState('')
    const [loading, setLoading] = useState(false)
    
    // Control de fecha para mostrar servicios de un mes específico
    const fechaActual = new Date()
    const [mesSeleccionado, setMesSeleccionado] = useState(fechaActual.getMonth())
    const [anioSeleccionado, setAnioSeleccionado] = useState(fechaActual.getFullYear())
    
    // Servicios seleccionados para pagar
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([])
    
    // Obtener todos los servicios pendientes
    const obtenerServiciosPendientes = () => {
        if (!props.servicios || !props.instanciasPago) return []
        
        const idPeriodo = `${anioSeleccionado}-${mesSeleccionado + 1}`
        const pendientes = []
        
        if (props.instanciasPago[idPeriodo]) {
            Object.entries(props.instanciasPago[idPeriodo]).forEach(([servicioId, instancia]) => {
                if (instancia.estado === 'pendiente' && props.servicios[servicioId]) {
                    pendientes.push({
                        id: servicioId,
                        nombre: props.servicios[servicioId].nombre,
                        categoria: props.servicios[servicioId].categoria,
                        monto: instancia.monto,
                        vencimiento: instancia.vencimiento
                    })
                }
            })
        }
        
        return pendientes.sort((a, b) => {
            // Ordenar por fecha de vencimiento (más cercanos primero)
            if (a.vencimiento && b.vencimiento) {
                return new Date(a.vencimiento) - new Date(b.vencimiento)
            }
            return 0
        })
    }
    
    // Toggle selección de servicio
    const toggleSeleccionServicio = (servicioId) => {
        const currentIndex = serviciosSeleccionados.findIndex(s => s.id === servicioId)
        const newSeleccionados = [...serviciosSeleccionados]
        
        if (currentIndex === -1) {
            // Agregar a seleccionados
            const servicio = obtenerServiciosPendientes().find(s => s.id === servicioId)
            if (servicio) {
                newSeleccionados.push(servicio)
            }
        } else {
            // Quitar de seleccionados
            newSeleccionados.splice(currentIndex, 1)
        }
        
        setServiciosSeleccionados(newSeleccionados)
    }
    
    // Calcular total a pagar
    const calcularTotal = () => {
        return serviciosSeleccionados.reduce((total, servicio) => total + servicio.monto, 0)
    }
    
    // Nombres de los meses
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    
    // Validación de formulario
    const validarFormulario = () => {
        if (serviciosSeleccionados.length === 0) {
            setShowSnackbar('Seleccione al menos un servicio para pagar')
            return false
        }
        
        return true
    }
    
    // Pagar servicios
    const pagarServicios = async () => {
        if (!validarFormulario()) return
        
        setLoading(true)
        
        try {
            const fechaPago = obtenerFecha()
            const idPeriodo = `${anioSeleccionado}-${mesSeleccionado + 1}`
            
            // Estructura de datos básica del pago
            const metodoPagoData = {
                tipo: 'efectivo',
                fecha: fechaPago,
                total: calcularTotal()
            }
            
            // Actualizar cada servicio
            const actualizaciones = {}
            
            serviciosSeleccionados.forEach(servicio => {
                actualizaciones[`instanciasPago/${idPeriodo}/${servicio.id}/estado`] = 'pagado'
                actualizaciones[`instanciasPago/${idPeriodo}/${servicio.id}/fechaPago`] = fechaPago
                actualizaciones[`instanciasPago/${idPeriodo}/${servicio.id}/metodoPago`] = 'efectivo'
            })
            
            // Guardar el historial de pago
            const historialPagoKey = database().ref().child(props.user.uid).child('historialPagosServicios').push().key
            
            actualizaciones[`historialPagosServicios/${historialPagoKey}`] = {
                servicios: serviciosSeleccionados.map(s => ({
                    id: s.id,
                    nombre: s.nombre,
                    monto: s.monto
                })),
                fechaPago,
                metodoPago: metodoPagoData,
                total: calcularTotal(),
                periodo: `${nombresMeses[mesSeleccionado]} ${anioSeleccionado}`
            }
            
            // Ejecutar todas las actualizaciones
            await database().ref().child(props.user.uid).update(actualizaciones)
            
            setShowSnackbar('Los servicios han sido pagados correctamente')
            setTimeout(() => {
                setLoading(false)
                setServiciosSeleccionados([])
            }, 2000)
        } catch (error) {
            setLoading(false)
            setShowSnackbar(`Error: ${error.message}`)
        }
    }
    
    // Si hay un servicio específico en la URL, seleccionarlo
    useEffect(() => {
        const queryParams = new URLSearchParams(props.location.search)
        const servicioId = queryParams.get('servicio')
        const periodo = queryParams.get('periodo')
        
        if (servicioId && periodo) {
            const [anio, mes] = periodo.split('-')
            setAnioSeleccionado(parseInt(anio))
            setMesSeleccionado(parseInt(mes) - 1)
            
            // Agregar a seleccionados cuando se cargan los datos
            if (props.servicios && props.instanciasPago) {
                const instancia = props.instanciasPago[periodo] && props.instanciasPago[periodo][servicioId]
                const servicio = props.servicios[servicioId]
                
                if (instancia && servicio && instancia.estado === 'pendiente') {
                    setServiciosSeleccionados([{
                        id: servicioId,
                        nombre: servicio.nombre,
                        categoria: servicio.categoria,
                        monto: instancia.monto,
                        vencimiento: instancia.vencimiento
                    }])
                }
            }
        }
    }, [props.location.search, props.servicios, props.instanciasPago])
    
    const serviciosPendientes = obtenerServiciosPendientes()

    return (
        <Layout history={props.history} page="Pagar Servicios" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Pagar Servicios {nombresMeses[mesSeleccionado]} {anioSeleccionado}
                        </Typography>
                    </Grid>
                    
                    {/* SELECTOR DE MES/AÑO */}
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Mes</InputLabel>
                            <Select
                                value={mesSeleccionado}
                                onChange={(e) => {
                                    setMesSeleccionado(e.target.value)
                                    setServiciosSeleccionados([])
                                }}
                                label="Mes"
                            >
                                {nombresMeses.map((nombre, index) => (
                                    <MenuItem key={index} value={index}>{nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select
                                value={anioSeleccionado}
                                onChange={(e) => {
                                    setAnioSeleccionado(e.target.value)
                                    setServiciosSeleccionados([])
                                }}
                                label="Año"
                            >
                                {[anioSeleccionado - 1, anioSeleccionado, anioSeleccionado + 1].map(anio => (
                                    <MenuItem key={anio} value={anio}>{anio}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* TABLA DE SERVICIOS PENDIENTES */}
                    <Grid item xs={12}>
                        <Paper elevation={2} style={{ padding: '16px' }}>
                            <Typography variant="h6" gutterBottom>
                                Servicios Pendientes de Pago
                            </Typography>
                            
                            {serviciosPendientes.length > 0 ? (
                                <TableContainer>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        indeterminate={serviciosSeleccionados.length > 0 && serviciosSeleccionados.length < serviciosPendientes.length}
                                                        checked={serviciosPendientes.length > 0 && serviciosSeleccionados.length === serviciosPendientes.length}
                                                        onChange={() => {
                                                            if (serviciosSeleccionados.length === serviciosPendientes.length) {
                                                                setServiciosSeleccionados([])
                                                            } else {
                                                                setServiciosSeleccionados([...serviciosPendientes])
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>Servicio</TableCell>
                                                <TableCell>Vencimiento</TableCell>
                                                <TableCell align="right">Monto</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {serviciosPendientes.map((servicio) => (
                                                <TableRow 
                                                    key={servicio.id}
                                                    selected={serviciosSeleccionados.some(s => s.id === servicio.id)}
                                                    hover
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={serviciosSeleccionados.some(s => s.id === servicio.id)}
                                                            onChange={() => toggleSeleccionServicio(servicio.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{servicio.nombre}</TableCell>
                                                    <TableCell>
                                                        {servicio.vencimiento ? (
                                                            <Grid container alignItems="center" spacing={1}>
                                                                <Grid item>
                                                                    <CalendarToday fontSize="small" />
                                                                </Grid>
                                                                <Grid item>
                                                                    {servicio.vencimiento}
                                                                </Grid>
                                                            </Grid>
                                                        ) : (
                                                            'No definido'
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                            ${formatMoney(servicio.monto)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Alert severity="info">
                                    No hay servicios pendientes de pago para este mes
                                </Alert>
                            )}
                        </Paper>
                    </Grid>
                    
                    {/* RESUMEN DE PAGO */}
                    {serviciosSeleccionados.length > 0 && (
                        <Grid item xs={12}>
                            <Paper elevation={2} style={{ padding: '16px' }}>
                                {/* TOTAL A PAGAR */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#01579b', color: 'white' }}>
                                            <Grid container alignItems="center" justify="space-between">
                                                <Grid item>
                                                    <Typography variant="h6">
                                                        Total a Pagar ({serviciosSeleccionados.length} servicios)
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                                                        ${formatMoney(calcularTotal())}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    
                                    {/* BOTONES */}
                                    <Grid item xs={12} container justify="flex-end" spacing={2}>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => setServiciosSeleccionados([])}
                                                startIcon={<Delete />}
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={pagarServicios}
                                                startIcon={<AttachMoney />}
                                                disabled={serviciosSeleccionados.length === 0}
                                                size="large"
                                            >
                                                Realizar Pago
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
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

export default connect(mapStateToProps, null)(PagarServicios) 