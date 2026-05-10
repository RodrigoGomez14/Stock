import React, { useState } from 'react'
import { 
    Grid, Card, CardContent, IconButton, Typography, Chip, Button, 
    CardHeader, Paper, Menu, MenuItem, Collapse, 
    List, ListItem, ListItemText, ListItemIcon
} from '@material-ui/core'
import { 
    MoreVert, AttachMoney, ExpandMore, ExpandLess, 
    Receipt, CalendarToday, Create, Category, EventNote
} from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'
import { content } from '../../Pages/styles/styles'
import { database } from '../../services'
import { Alert } from '@material-ui/lab'

export const CardServicio = ({ servicio, instancia, eliminarServicio, mesSeleccionado, anioSeleccionado }) => {
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null)
    const [expanded, setExpanded] = useState(false)

    // Estado para determinar el color de la tarjeta
    const getCardColor = () => {
        if (!instancia) return classes.cardSinBoleta
        
        switch (instancia.estado) {
            case 'pagado':
                return classes.cardPagado
            case 'pendiente':
                return classes.cardPendiente
            default:
                return classes.cardSinBoleta
        }
    }

    // Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    
    const handleClose = () => {
        setAnchorEl(null)
    }
    
    // Actualizar estado para recibir boleta
    const recibirBoleta = () => {
        setAnchorEl(null)
        
        // Verificar que servicio.user existe y tiene uid
        if (!servicio.user || !servicio.user.uid) {
            console.error("Error: Usuario no disponible")
            return
        }
        
        // Redirigir a la página de recibir boleta
        window.location.href = '/Recibir-Boleta'
    }
    
    // Verificar si se debe mostrar el servicio según su frecuencia
    const mostrarSegunFrecuencia = () => {
        if (servicio.frecuencia === 'mensual') return true
        if (servicio.frecuencia === 'anual' && servicio.mesPago === (mesSeleccionado + 1)) return true
        if (servicio.frecuencia === 'personalizado' && servicio.mesesPago && servicio.mesesPago.includes(mesSeleccionado + 1)) return true
        return false
    }
    
    // Formatear fecha de vencimiento
    const formatearFecha = (fecha) => {
        if (!fecha) return 'Sin fecha'
        return fecha
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card className={getCardColor()}>
                <Paper elevation={3} className={classes.cardHeader}>
                    <CardHeader
                        action={
                            <>
                                <IconButton onClick={() => setExpanded(!expanded)}>
                                    {expanded ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <Link
                                        style={{ color: '#fff', textDecoration: 'none' }}
                                        className={classes.link}
                                        to={{
                                            pathname: '/Editar-Servicio',
                                            search: `${servicio.id}`
                                        }}
                                    >
                                        <MenuItem>Editar Servicio</MenuItem>
                                    </Link>
                                    
                                    {!instancia && (
                                        <MenuItem onClick={recibirBoleta}>
                                            Recibir Boleta
                                        </MenuItem>
                                    )}
                                    
                                    {instancia && instancia.estado === 'pendiente' && (
                                        <Link
                                            style={{ color: '#fff', textDecoration: 'none' }}
                                            className={classes.link}
                                            to={{
                                                pathname: '/Pagar-Servicios',
                                                search: `?servicio=${servicio.id}&periodo=${anioSeleccionado}-${mesSeleccionado + 1}`
                                            }}
                                        >
                                            <MenuItem>Pagar</MenuItem>
                                        </Link>
                                    )}
                                    
                                    <MenuItem className={classes.deleteButton} onClick={() => {
                                        setAnchorEl(null)
                                        eliminarServicio()
                                    }}>
                                        Eliminar
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                        title={
                            <Typography variant="h6">{servicio.nombre}</Typography>
                        }
                        subheader={
                            <Chip
                                size="small"
                                label={servicio.categoria}
                                variant="outlined"
                                icon={<Category />}
                            />
                        }
                    />
                </Paper>
                
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Receipt />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Estado" 
                                    secondary={
                                        !instancia 
                                            ? "Sin boleta recibida" 
                                            : instancia.estado === 'pagado' 
                                                ? "Pagado" 
                                                : "Pendiente de pago"
                                    } 
                                />
                            </ListItem>
                            
                            {instancia && (
                                <>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AttachMoney />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Monto" 
                                            secondary={`$ ${formatMoney(instancia.monto || 0)}`} 
                                        />
                                    </ListItem>
                                    
                                    <ListItem>
                                        <ListItemIcon>
                                            <CalendarToday />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Vencimiento" 
                                            secondary={formatearFecha(instancia.vencimiento)} 
                                        />
                                    </ListItem>
                                    
                                    {instancia.fechaPago && (
                                        <ListItem>
                                            <ListItemIcon>
                                                <CalendarToday />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Fecha de Pago" 
                                                secondary={formatearFecha(instancia.fechaPago)} 
                                            />
                                        </ListItem>
                                    )}
                                    
                                    {instancia.metodoPago && (
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachMoney />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Método de Pago" 
                                                secondary={instancia.metodoPago} 
                                            />
                                        </ListItem>
                                    )}
                                </>
                            )}
                            
                            <ListItem>
                                <ListItemIcon>
                                    <EventNote />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Frecuencia" 
                                    secondary={
                                        servicio.frecuencia === 'mensual' 
                                            ? "Mensual" 
                                            : servicio.frecuencia === 'anual' 
                                                ? `Anual (${servicio.mesPago})` 
                                                : "Personalizado"
                                    } 
                                />
                            </ListItem>
                            
                            {servicio.nota && (
                                <ListItem>
                                    <ListItemIcon>
                                        <Create />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Nota" 
                                        secondary={servicio.nota} 
                                    />
                                </ListItem>
                            )}
                        </List>
                    </CardContent>
                </Collapse>
                
                <Paper elevation={3} className={classes.cardActions}>
                    <Grid container justify="space-between" alignItems="center" style={{ padding: '8px 16px' }}>
                        {instancia ? (
                            <>
                                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                    ${formatMoney(instancia.monto || 0)}
                                </Typography>
                                <Chip 
                                    label={instancia.estado === 'pagado' ? 'PAGADO' : 'PENDIENTE'}
                                    color={instancia.estado === 'pagado' ? 'primary' : 'secondary'}
                                    size="small"
                                />
                            </>
                        ) : (
                            <Typography variant="subtitle1" style={{ width: '100%', textAlign: 'center' }}>
                                Sin boleta recibida
                            </Typography>
                        )}
                    </Grid>
                </Paper>
            </Card>
        </Grid>
    )
} 