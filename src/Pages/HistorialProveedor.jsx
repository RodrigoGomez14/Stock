import React,{useState,useEffect} from 'react'
import { withStore } from '../context/AppContext'
import {Layout} from './Layout'
import { makeStyles } from 'tss-react/mui'
import { Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress,Table,TableHead,TableRow,TableCell,TableBody,TableContainer,Button,Menu,MenuItem,Divider } from '@mui/material'
import {Alert} from '@mui/material'
import {MenuCheques} from '../components/Historial/MenuCheques'
import {MenuChequesPersonales} from '../components/Historial/MenuChequesPersonales'
import {EditOutlined,ArrowDropDown, AddOutlined} from '@mui/icons-material'
import {Deuda} from '../components/Shared/Deuda'
import {ListaDePedidos} from '../components/Shared/ListaDePedidos'
import {Detalles} from '../components/Shared/Detalles'
import {DialogConfirmDelete} from '../components/Shared/DialogConfirmDelete'
import { database } from '../services'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'
import Empty from '../images/Empty.png'
import {Pago} from '../components/Historial-De-Pagos/Pago'


// COMPONENT
const HistorialProveedor=(props)=>{
    const classes = content()

    const [pagos,setPagos]= useState(props.proveedores[checkSearch(props.history.location.search)].pagos)   

    return(
        <Layout history={props.history} page={`Historial ${props.proveedores[checkSearch(props.history.location.search)].datos.nombre}`} user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={3}>
                    <Grid container item xs={12} justify='center'>
                        <Link 
                            style={{color:'#fff',textDecoration:'none'}}
                            to={{
                                pathname:'/Nuevo-Pago-Proveedor',
                                props:{
                                    proveedor:props.proveedores[checkSearch(props.history.location.search)].datos.nombre
                                },
                                search:`${props.proveedores[checkSearch(props.history.location.search)].datos.nombre}`
                            }
                        }>
                            <Button 
                                variant='contained'
                                color='primary'
                                startIcon={<AddOutlined/>}
                            >
                                Nuevo Pago
                            </Button>
                        </Link>
                    </Grid>
                    <Grid container xs={12} justify='center' spacing={2}>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.titleDetallesCard}>Fecha</TableCell>
                                        <TableCell className={classes.titleDetallesCard}>Total</TableCell>
                                        <TableCell className={classes.titleDetallesCard}>Adeudado</TableCell>
                                        <TableCell className={classes.titleDetallesCard}>Pago</TableCell>
                                        <TableCell className={classes.titleDetallesCard}>Deuda Anterior</TableCell>
                                        <TableCell className={classes.titleDetallesCard}>Deuda Actualizada</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagos?
                                        Object.keys(pagos).reverse().map(pago=>(
                                            <Pago pago={pagos[pago]} userType='proveedor' user={props.proveedores[checkSearch(props.history.location.search)].datos.nombre}/>
                                        ))
                                        :
                                        <Grid container xs={12} justify='center' spacing={2}>
                                            <Grid container item xs={12} justify='center'>
                                                <Typography variant='h5'>{checkSearch(props.history.location.search)} no tiene historial de pagos</Typography>
                                            </Grid>
                                            <Grid item>
                                                <img src={Empty} alt="" height='600px'/>
                                            </Grid>
                                        </Grid>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}

export default withStore(HistorialProveedor)

