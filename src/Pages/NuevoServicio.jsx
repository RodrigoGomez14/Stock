import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Layout } from './Layout'
import { 
    Typography, Backdrop, Grid, CircularProgress, Snackbar, Paper, 
    TextField, FormControl, InputLabel, Select, MenuItem, Button,
    FormControlLabel, Checkbox, Chip, FormLabel, FormGroup,
    FormHelperText
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { database } from '../services'
import { content } from './styles/styles'
import { checkSearch } from '../utilities'

// COMPONENT
const NuevoServicio = (props) => {
    const classes = content()
    const [nombre, setNombre] = useState('')
    const [categoria, setCategoria] = useState('')
    const [nuevaCategoria, setNuevaCategoria] = useState('')
    const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false)
    const [nota, setNota] = useState('')
    const [frecuencia, setFrecuencia] = useState('mensual')
    const [mesPago, setMesPago] = useState(1)
    const [mesesPago, setMesesPago] = useState([])
    
    const [showSnackbar, setShowSnackbar] = useState('')
    const [loading, setLoading] = useState(false)
    
    // Para validación de formulario
    const [errors, setErrors] = useState({})
    
    // Obtener todas las categorías existentes
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
    
    // Manejar cambios en checkboxes de meses
    const handleMesPagoChange = (mes) => {
        const currentIndex = mesesPago.indexOf(mes)
        const newMesesPago = [...mesesPago]
        
        if (currentIndex === -1) {
            newMesesPago.push(mes)
        } else {
            newMesesPago.splice(currentIndex, 1)
        }
        
        setMesesPago(newMesesPago)
    }
    
    // Manejar cambio de categoría
    const handleCategoriaChange = (event) => {
        const value = event.target.value
        
        if (value === "nueva_categoria") {
            setMostrarNuevaCategoria(true)
            setCategoria("")
        } else {
            setMostrarNuevaCategoria(false)
            setCategoria(value)
            setNuevaCategoria("")
        }
    }
    
    // Validar formulario
    const validarFormulario = () => {
        const newErrors = {}
        
        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
        }
        
        if (!categoria && !nuevaCategoria) {
            newErrors.categoria = 'La categoría es requerida'
        }
        
        if (mostrarNuevaCategoria && !nuevaCategoria.trim()) {
            newErrors.nuevaCategoria = 'Ingrese una nueva categoría'
        }
        
        if (frecuencia === 'anual' && !mesPago) {
            newErrors.mesPago = 'Seleccione el mes de pago'
        }
        
        if (frecuencia === 'personalizado' && mesesPago.length === 0) {
            newErrors.mesesPago = 'Seleccione al menos un mes'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    // Guardar servicio
    const guardarServicio = () => {
        if (!validarFormulario()) return
        
        setLoading(true)
        
        const categoriaFinal = mostrarNuevaCategoria ? nuevaCategoria : categoria
        
        let servicioData = {
            nombre,
            categoria: categoriaFinal,
            nota: nota || null,
            frecuencia
        }
        
        if (frecuencia === 'anual') {
            servicioData.mesPago = mesPago
        } else if (frecuencia === 'personalizado') {
            servicioData.mesesPago = mesesPago.sort((a, b) => a - b)
        }
        
        // Si estamos editando
        if (props.history.location.search) {
            const servicioId = checkSearch(props.history.location.search)
            
            database().ref().child(props.user.uid).child('servicios').child(servicioId).update(servicioData)
                .then(() => {
                    setShowSnackbar('El servicio se actualizó correctamente')
                    setTimeout(() => {
                        setLoading(false)
                        props.history.push('/Servicios')
                    }, 2000)
                })
                .catch(error => {
                    setLoading(false)
                    setShowSnackbar(`Error: ${error.message}`)
                })
        } 
        // Si estamos creando uno nuevo
        else {
            database().ref().child(props.user.uid).child('servicios').push(servicioData)
                .then(() => {
                    setShowSnackbar('El servicio se agregó correctamente')
                    setTimeout(() => {
                        setLoading(false)
                        props.history.push('/Servicios')
                    }, 2000)
                })
                .catch(error => {
                    setLoading(false)
                    setShowSnackbar(`Error: ${error.message}`)
                })
        }
    }
    
    // Cargar datos para editar
    useEffect(() => {
        if (props.history.location.search && props.servicios) {
            const servicioId = checkSearch(props.history.location.search)
            const servicio = props.servicios[servicioId]
            
            if (servicio) {
                setNombre(servicio.nombre || '')
                setCategoria(servicio.categoria || '')
                setNota(servicio.nota || '')
                setFrecuencia(servicio.frecuencia || 'mensual')
                
                if (servicio.frecuencia === 'anual') {
                    setMesPago(servicio.mesPago || 1)
                } else if (servicio.frecuencia === 'personalizado') {
                    setMesesPago(servicio.mesesPago || [])
                }
            }
        }
    }, [props.servicios, props.history.location.search])
    
    // Nombres de los meses
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    return (
        <Layout history={props.history} page={props.history.location.search ? "Editar Servicio" : "Nuevo Servicio"} user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            {props.history.location.search ? "Editar Servicio" : "Agregar Nuevo Servicio"}
                        </Typography>
                    </Grid>
                    
                    {/* NOMBRE */}
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Servicio"
                            variant="outlined"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                            required
                        />
                    </Grid>
                    
                    {/* CATEGORÍA */}
                    <Grid item xs={12} sm={mostrarNuevaCategoria ? 6 : 12}>
                        <FormControl 
                            variant="outlined" 
                            fullWidth
                            error={!!errors.categoria && !mostrarNuevaCategoria}
                        >
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={categoria}
                                onChange={handleCategoriaChange}
                                label="Categoría"
                                disabled={mostrarNuevaCategoria}
                            >
                                <MenuItem value="">
                                    <em>Seleccione una categoría</em>
                                </MenuItem>
                                {obtenerCategorias().map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                                <MenuItem value="nueva_categoria">
                                    <em>+ Nueva Categoría</em>
                                </MenuItem>
                            </Select>
                            {errors.categoria && !mostrarNuevaCategoria && <FormHelperText>{errors.categoria}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    
                    {/* NUEVA CATEGORÍA */}
                    {mostrarNuevaCategoria && (
                        <Grid item xs={12} sm={6} container spacing={1} alignItems="center">
                            <Grid item xs={9}>
                                <TextField
                                    label="Nueva Categoría"
                                    variant="outlined"
                                    fullWidth
                                    value={nuevaCategoria}
                                    onChange={(e) => setNuevaCategoria(e.target.value)}
                                    error={!!errors.nuevaCategoria}
                                    helperText={errors.nuevaCategoria || "Ingrese el nombre de la nueva categoría"}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => {
                                        setMostrarNuevaCategoria(false)
                                        setNuevaCategoria('')
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    
                    {/* NOTA */}
                    <Grid item xs={12}>
                        <TextField
                            label="Nota o detalle (opcional)"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                        />
                    </Grid>
                    
                    {/* FRECUENCIA */}
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Frecuencia de Pago</InputLabel>
                            <Select
                                value={frecuencia}
                                onChange={(e) => setFrecuencia(e.target.value)}
                                label="Frecuencia de Pago"
                            >
                                <MenuItem value="mensual">Mensual</MenuItem>
                                <MenuItem value="anual">Anual</MenuItem>
                                <MenuItem value="personalizado">Personalizado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* MES DE PAGO (para anual) */}
                    {frecuencia === 'anual' && (
                        <Grid item xs={12} sm={8}>
                            <FormControl 
                                variant="outlined" 
                                fullWidth
                                error={!!errors.mesPago}
                            >
                                <InputLabel>Mes de Pago</InputLabel>
                                <Select
                                    value={mesPago}
                                    onChange={(e) => setMesPago(e.target.value)}
                                    label="Mes de Pago"
                                >
                                    {nombresMeses.map((nombre, index) => (
                                        <MenuItem key={index + 1} value={index + 1}>{nombre}</MenuItem>
                                    ))}
                                </Select>
                                {errors.mesPago && <FormHelperText>{errors.mesPago}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    )}
                    
                    {/* MESES DE PAGO (para personalizado) */}
                    {frecuencia === 'personalizado' && (
                        <Grid item xs={12}>
                            <FormControl 
                                component="fieldset" 
                                fullWidth
                                error={!!errors.mesesPago}
                            >
                                <FormLabel component="legend">Seleccione los meses de pago</FormLabel>
                                <FormHelperText>{errors.mesesPago}</FormHelperText>
                                <FormGroup row>
                                    {nombresMeses.map((nombre, index) => (
                                        <FormControlLabel
                                            key={index + 1}
                                            control={
                                                <Checkbox 
                                                    checked={mesesPago.indexOf(index + 1) !== -1}
                                                    onChange={() => handleMesPagoChange(index + 1)}
                                                    name={nombre}
                                                    color="primary"
                                                />
                                            }
                                            label={nombre}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            
                            <Grid container spacing={1} style={{ marginTop: '8px' }}>
                                {mesesPago.sort((a, b) => a - b).map(mes => (
                                    <Grid item key={mes}>
                                        <Chip 
                                            label={nombresMeses[mes - 1]} 
                                            onDelete={() => handleMesPagoChange(mes)}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    
                    {/* BOTONES */}
                    <Grid item xs={12} container justify="flex-end" spacing={2}>
                        <Grid item>
                            <Button 
                                variant="outlined" 
                                onClick={() => props.history.push('/Servicios')}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={guardarServicio}
                            >
                                {props.history.location.search ? "Actualizar Servicio" : "Guardar Servicio"}
                            </Button>
                        </Grid>
                    </Grid>
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
        servicios: state.servicios
    }
}

export default connect(mapStateToProps, null)(NuevoServicio) 