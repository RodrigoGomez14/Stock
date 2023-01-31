import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import CardCuentaBancaria from '../components/Cuentas-Bancarias/CardCuentaBancaria'
import Empty from '../images/Empty.png'
// COMPONENT
const CuentasBancarias=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    
    return(
        <Layout history={props.history} page="Cuentas Bancarias" user={props.user.uid}>
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
                    </Grid>

                    {/* CLIENT LIST */}
                    <Grid container item xs={12} spacing={2} >
                        {props.CuentasBancarias?
                            <Grid container xs={12} justify='space-around'>
                                {Object.keys(props.CuentasBancarias).map(key=>(
                                    <CardCuentaBancaria cuenta={key}/>
                                ))}
                            </Grid>
                            :
                            <>
                                <Grid item>
                                    <img src={Empty} alt="" height='600px'/>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h4'>No hay Cuentas Bancarias</Typography>
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
        CuentasBancarias:state.CuentasBancarias
    }
}
export default connect(mapStateToProps,null)(CuentasBancarias)