import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,IconButton,Grid,Chip,Button,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'


const useStyles=makeStyles(theme=>({
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
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
    cardContent:{
        padding:0,
        height:'100%',
        textAlign:'center',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
    },
    card:{
        height:'150px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'

    },
    link:{
        outline:'none',
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    marginTop:{
        marginTop:theme.spacing(1),
    },
    container:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1)
    },
    containerProveedores:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    }
    
}))
const Proveedores=(props)=>{
    const classes = useStyles()
    let [search,setSearch]=useState('')


    const renderProveedores = () =>
        Object.keys(props.proveedores).map(key=>{
                return(
                    <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:key.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                        <Link 
                            className={classes.link}
                            to={{
                            pathname:'/Proveedor',
                            search:`${key}`
                        }}>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" component="h2">
                                            {key}
                                        </Typography>
                                        <div className={classes.flex}>
                                            <Chip
                                                className={props.proveedores[key].datos.deuda?classes.success:classes.danger}
                                                variant="outlined"
                                                icon={<AttachMoney className={props.proveedores[key].datos.deuda?classes.iconSuccess:classes.iconDanger} />}
                                                label={props.proveedores[key].datos.deuda?props.proveedores[key].datos.deuda:'0'}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                        </Link>
                    </Grid>
                )
        })
    return(
        <Layout history={props.history} page="Proveedores" user={props.user.uid}>
                <Grid container justify='center' className={classes.container}>
                    <Grid container justify='center' alignItems='center' className={classes.container} >
                        <Grid item>
                            <Link 
                                to='/Nuevo-Proveedor'>
                                <IconButton>
                                    <PersonAdd/>
                                </IconButton>
                            </Link>
                        </Grid>
                        <Grid item>
                            <TextField
                                value={search}
                                onChange={e=>{
                                    setSearch(e.target.value)
                                }}
                                label='Buscar Proveedor'
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' className={classes.containerProveedores}> 
                        {props.proveedores?
                            <Grid item xs={12} sm={10} md={9} lg={8}>
                                <Grid container justify='space-around'  alignItems='center' spacing={1}>
                                {renderProveedores()}
                                </Grid>
                            </Grid>
                            :
                            <Typography variant='h5'>
                                Aun no hay ningun Proveedor ingresado
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
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Proveedores)