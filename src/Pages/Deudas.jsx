import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Button,Card,CardContent,Typography,TextField,CardActions,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'

const useStyles=makeStyles(theme=>({
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        marginTop:theme.spacing(2),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        marginTop:theme.spacing(2),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    card:{
        minHeight:'150px',
        maxHeight:'200px',
    },
    link:{
        outline:'none',
        textDecoration:'none',
        color:theme.palette.primary.contrastText
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block',
    },
    container:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1)
    },
    containerClientes:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    },
    title:{
        color:'white',
        textAlign:'center'
    },
    wrapper:{
        minHeight:'200px'
    }
}))
const Deudas=(props)=>{
    const classes = useStyles()
    let [search,setSearch]=useState('')


    const renderClientes = () =>(
        <>
            <Grid item justify='center' xs={12}>
                <Typography  variant='h4' className={classes.title}>
                    Clientes
                </Typography>
            </Grid>
            {Object.keys(props.clientes).map(key=>(
                props.clientes[key].datos.deuda != 0 ?
                        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:key.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Link 
                                        className={classes.link}
                                        to={{
                                        pathname:'/Cliente',
                                        search:key
                                    }}>
                                        <Typography variant="h5" component="h2">
                                            {key}
                                        </Typography>
                                    </Link>
                                    <Chip
                                        className={props.clientes[key].datos.deuda>0?classes.danger:classes.success}
                                        variant="outlined"
                                        icon={<AttachMoney className={props.clientes[key].datos.deuda>0?classes.iconDanger:classes.iconSuccess} />}
                                        label={formatMoney(props.clientes[key].datos.deuda)}
                                    />
                                </CardContent>
                                <CardActions>
                                    <Link 
                                        className={classes.link}
                                        to={{
                                        pathname:'/Historial',
                                        search:key
                                    }}>
                                        <Button size='small'>
                                            Ver Historial de pagos
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    :
                    null
            ))}
        </>
    )

    const renderProveedores = () =>(
        <>
            <Grid item justify='center' xs={12}>
                <Typography  variant='h4' className={classes.title}>
                    Proveedores
                </Typography>
            </Grid>
            {Object.keys(props.proveedores).map(key=>(
                props.proveedores[key].datos.deuda != 0 ?
                        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:key.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                            <Card className={classes.card}>
                                <CardContent className={classes.cardContent}>
                                    <Link 
                                        className={classes.link}
                                        to={{
                                        pathname:'/Proveedor',
                                        search:key
                                    }}>
                                        <Typography variant="h5" component="h2">
                                            {key}
                                        </Typography>
                                    </Link>
                                    <Chip
                                        className={props.proveedores[key].datos.deuda>0?classes.danger:classes.success}
                                        variant="outlined"
                                        icon={<AttachMoney className={props.proveedores[key].datos.deuda>0?classes.iconDanger:classes.iconSuccess} />}
                                        label={props.proveedores[key].datos.deuda}
                                    />
                                </CardContent>
                                <CardActions>
                                </CardActions>
                            </Card>
                        </Grid>
                    :
                    null
            ))}
        </>
    )

    return(
        <Layout history={props.history} page="Deudas" user={props.user.uid}>
            <Grid container justify='center' alignItems='center' className={classes.container} >
                <Grid item>
                    <TextField
                        value={search}
                        onChange={e=>{
                            setSearch(e.target.value)
                        }}
                        disabled={!props.clientes}
                        label='Buscar Deudor'
                    />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.container} >
                    {props.clientes?
                        <Grid item xs={12} sm={10} md={9} lg={8}>
                            <Grid container justify='space-around' className={classes.wrapper}  alignItems='center' spacing={1}>
                                {renderClientes()}
                            </Grid>
                            <Grid container justify='space-around' className={classes.wrapper}  alignItems='center' spacing={1}>
                                {renderProveedores()}
                            </Grid>
                        </Grid>
                        :
                        <Typography variant='h5'>
                            Aun no hay ningun cliente ingresado
                        </Typography>
                    }
                </Grid>
            </Grid>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(Deudas)