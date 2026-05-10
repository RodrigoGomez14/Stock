import React, {useState, useEffect} from 'react'
import { withStore } from '../context/AppContext'
import {Layout} from './Layout'
import {Paper, Typography, Grid, Card, CardContent, Divider, IconButton, Chip, Button, Snackbar, Backdrop, CircularProgress} from '@mui/material'
import {ArrowBack, DeleteOutline} from '@mui/icons-material'
import {Alert} from '@mui/material'
import {formatMoney, obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import ApexCharts from 'react-apexcharts'
import {DialogConfirmAction} from '../components/Dialogs/DialogConfirmAction'
import { database, firebase } from '../services'

// COMPONENT
const Producto = (props) => {
    const classes = content()
    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState('')
    const [showDialogDelete, setShowDialogDelete] = useState(false)
    const [producto, setProducto] = useState(null)
    
    useEffect(() => {
        // Obtener el nombre del producto de la URL
        const nombreProducto = props.location.search.slice(1)
        
        // Mostrar mensaje de carga
        setProducto(null)
        
        // Buscar el producto en la lista de productos
        if (props.productos && nombreProducto) {
            // PequeÃ±o retraso para asegurar que los datos se actualicen correctamente
            setTimeout(() => {
                const productoEncontrado = props.productos[nombreProducto]
                if (productoEncontrado) {
                    setProducto({
                        nombre: nombreProducto,
                        ...productoEncontrado
                    })
                } else {
                    setShowSnackbar('No se pudo encontrar el producto')
                    setTimeout(() => {
                        props.history.replace('/Productos')
                    }, 2000)
                }
            }, 100)
        }
    }, [props.productos, props.location.search, props.history])

    // FunciÃ³n para eliminar un producto
    const eliminarProducto = () => {
        setLoading(true)
        database().ref().child(props.user.uid).child('productos').child(producto.nombre).remove()
        .then(() => {
            setShowSnackbar('El producto se eliminÃ³ correctamente')
            setShowDialogDelete(false)
            setTimeout(() => {
                props.history.replace('/Productos')
                setLoading(false)
            }, 2000)
        })
        .catch(() => {
            setLoading(false)
            setShowSnackbar('Error al eliminar el producto')
        })
    }

    // Generar grÃ¡fico de componentes/subproductos si existen
    const generateChartSubproductos = (subproductos) => {
        if (!subproductos || subproductos.length === 0) return null

        const series = []
        const labels = []
    
        subproductos.forEach(subproducto => {
            series.push(parseInt(subproducto.cantidad))
            labels.push(subproducto.nombre)
        })

        // ConfiguraciÃ³n del grÃ¡fico
        const options = {
            series: series,
            labels: labels,
            theme: {
                mode: 'dark',
                palette: 'palette2'
            },
            dataLabels: {
                dropShadow: {
                    enabled: true,
                    left: 2,
                    top: 2,
                    opacity: 0.5
                }
            },
            tooltip: {
                fillSeriesColor: false
            }
        }
        
        return (
            <Card className={classes.cardCliente}>
                <CardContent>
                    <Typography variant="h6" className={classes.titleCardCliente}>
                        Componentes
                    </Typography>
                    <Grid container justify="center">
                        <ApexCharts options={options} series={series} type='donut' height={300} width={400} />
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    // Generar grÃ¡fico de historial de stock si existe
    const generateChartHistorialStock = (historialDeStock) => {
        if (!historialDeStock) return null

        let data = []
        let labels = []
        
        Object.keys(historialDeStock).forEach(movimiento => {
            data.push(historialDeStock[movimiento].cantidad)
            labels.push(historialDeStock[movimiento].fecha)
        })
    
        // ConfiguraciÃ³n del grÃ¡fico
        const options = {
            labels: labels,
            chart: {
                type: 'area',
                height: 300,
                toolbar: {
                    show: true
                }
            },
            stroke: {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            title: {
                text: 'Historial de Stock',
                style: {
                    color: '#fff'
                }
            },
            xaxis: {
                labels: {
                    style: {
                        colors: '#fff'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#fff'
                    }
                }
            }
        }
    
        const series = [
            {
                name: 'Stock',
                data: data
            }
        ]
        
        return (
            <Card className={classes.cardCliente}>
                <CardContent>
                    <Typography variant="h6" className={classes.titleCardCliente}>
                        Historial de Stock
                    </Typography>
                    <ApexCharts options={options} series={series} type='area' height={300} />
                </CardContent>
            </Card>
        )
    }

    // Mostrar informaciÃ³n de cadena de producciÃ³n si existe
    const showCadenaDeProduccion = (cadena) => {
        if (!cadena || cadena.length === 0) return null

        return (
            <Card className={classes.cardCliente}>
                <CardContent>
                    <Typography variant="h6" className={classes.titleCardCliente}>
                        Cadena de ProducciÃ³n
                    </Typography>
                    <Grid container spacing={2}>
                        {cadena.map((proceso, index) => (
                            <Grid item xs={12} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Paso {index + 1}: {proceso.nombre}
                                        </Typography>
                                        {proceso.descripcion && (
                                            <Typography variant="body2">
                                                {proceso.descripcion}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    // Mostrar informaciÃ³n de matrices si existen
    const showMatrices = (matrices) => {
        if (!matrices || matrices.length === 0) return null

        return (
            <Card className={classes.cardCliente}>
                <CardContent>
                    <Typography variant="h6" className={classes.titleCardCliente}>
                        Matrices
                    </Typography>
                    <Grid container spacing={2}>
                        {matrices.map((matriz, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Matriz #{index + 1}
                                        </Typography>
                                        {matriz.ubicacion && (
                                            <Typography variant="body2">
                                                UbicaciÃ³n: {matriz.ubicacion}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    const iniciarCadenaDeProduccion = (nombre) => {
        if (!nombre) return;
        
        setLoading(true);
        let aux = [];
        aux.producto = nombre;
        aux.fechaDeInicio = obtenerFecha();
        aux['procesos'] = [];
        
        if (producto.cadenaDeProduccion) {
            producto.cadenaDeProduccion.forEach(proceso => {
                aux['procesos'].push(proceso);
            });
            aux['procesos'][0].fechaDeInicio = obtenerFecha();
            
            database().ref().child(props.user.uid).child('cadenasActivas').push(aux)
            .then(() => {
                setShowSnackbar('La cadena se iniciÃ³ correctamente!!');
                setTimeout(() => {
                    props.history.replace('/Cadenas-De-Produccion');
                    setLoading(false);
                }, 2000);
            })
            .catch(() => {
                setLoading(false);
                setShowSnackbar('Error al iniciar la cadena de producciÃ³n');
            });
        } else {
            setLoading(false);
            setShowSnackbar('Este producto no tiene cadena de producciÃ³n definida');
        }
    };

    return (
        <Layout history={props.history} page="Detalles de Producto" user={props.user.uid}>
            <Paper className={classes.content}>
                {producto ? (
                    <Grid container spacing={3}>
                        {/* Cabecera con botÃ³n de volver y tÃ­tulo */}
                        <Grid container item xs={12} alignItems="center">
                            <Grid item>
                                <IconButton onClick={() => props.history.goBack()}>
                                    <ArrowBack />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{producto.nombre}</Typography>
                            </Grid>
                            <Grid item style={{marginLeft: 'auto'}}>
                                <IconButton 
                                    className={classes.deleteButton}
                                    onClick={() => setShowDialogDelete(true)}
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </Grid>
                        </Grid>

                        {/* InformaciÃ³n principal */}
                        <Grid item xs={12}>
                            <Card className={classes.cardCliente}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" className={classes.titleCardCliente}>
                                                InformaciÃ³n General
                                            </Typography>
                                            <Divider style={{marginBottom: 10}} />
                                            <Typography variant="body1">
                                                <strong>Precio:</strong> ${formatMoney(producto.precio || 0)}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Cantidad en Stock:</strong> {producto.cantidad || 0}
                                            </Typography>
                                            {producto.descripcion && (
                                                <Typography variant="body1">
                                                    <strong>DescripciÃ³n:</strong> {producto.descripcion}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" className={classes.titleCardCliente}>
                                                Acciones
                                            </Typography>
                                            <Divider style={{marginBottom: 10}} />
                                            <Grid container spacing={1}>
                                                <Grid item>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary"
                                                        onClick={() => props.history.push({
                                                            pathname: '/Editar-Producto',
                                                            search: producto.nombre
                                                        })}
                                                    >
                                                        Editar Producto
                                                    </Button>
                                                </Grid>
                                                {producto.cadenaDeProduccion && producto.cadenaDeProduccion.length > 0 && (
                                                    <Grid item>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary"
                                                            onClick={() => iniciarCadenaDeProduccion(producto.nombre)}
                                                        >
                                                            Iniciar Cadena
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* GrÃ¡ficos y detalles adicionales */}
                        <Grid item xs={12} md={6}>
                            {showCadenaDeProduccion(producto.cadenaDeProduccion)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {showMatrices(producto.matrices)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {generateChartSubproductos(producto.subproductos)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {generateChartHistorialStock(producto.historialDeStock)}
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container justify="center" alignItems="center" style={{ minHeight: '70vh' }}>
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'center', marginTop: 20 }}>
                            <Typography variant="h6">Cargando informaciÃ³n del producto...</Typography>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => props.history.push('/Productos')}
                                style={{ marginTop: 15 }}
                            >
                                Volver a la lista de productos
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>

            {/* BACKDROP & SNACKBAR */}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={showSnackbar !== ''} autoHideDuration={2000} onClose={() => setShowSnackbar('')}>
                <Alert severity="success" variant='filled'>
                    {showSnackbar}
                </Alert>
            </Snackbar>
            <DialogConfirmAction 
                showDialog={showDialogDelete} 
                setShowDialog={setShowDialogDelete} 
                action={eliminarProducto} 
                tipo='el Producto'
            />
        </Layout>
    )
}

export default withStore(Producto)
