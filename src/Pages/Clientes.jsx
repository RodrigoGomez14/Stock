import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import { CardCliente } from '../components/Clientes/CardCliente'
import Empty from '../images/Empty.png'
// COMPONENT
const Clientes=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    
    return(
        <Layout history={props.history} page="Clientes" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container spacing={4}>
                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
                        <Grid item>
                            <Link 
                                to='/Nuevo-Cliente'>
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
                                disabled={!props.clientes}
                                label='Buscar Cliente'
                            />
                        </Grid>
                    </Grid>

                    {/* CLIENT LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                        {props.clientes?
                            Object.keys(props.clientes).map(key=>(
                                <CardCliente datos={props.clientes[key].datos} search={search}/>
                            ))
                            :
                            <>
                                <Grid item>
                                    <img src={Empty} alt="" height='600px'/>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h4'>No hay Clientes Ingresados</Typography>
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
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Clientes)