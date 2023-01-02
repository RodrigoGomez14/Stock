import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,IconButton,Grid,Chip,Button,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import {CardProveedor} from '../components/Proveedores/CardProveedor'
import Empty from '../images/Empty.png'
// COMPONENT
const Proveedores=(props)=>{
    const classes = content()
    let [search,setSearch]=useState('')
            
    return(
        <Layout history={props.history} page="Proveedores" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container spacing={4}>
                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
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
                    {/* PROVEEDOR LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2}> 
                        {props.proveedores?
                            Object.keys(props.proveedores).map(key=>(
                                <CardProveedor datos={props.proveedores[key].datos} search={search}/>
                            ))
                            :
                            <>
                            <Grid item>
                                <img src={Empty} alt="" height='500px'/>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h4'>No hay Proveedores Ingresados</Typography>
                            </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Proveedores)