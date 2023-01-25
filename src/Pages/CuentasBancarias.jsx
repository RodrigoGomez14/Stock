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
const CuentasBancarias=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    
    return(
        <Layout history={props.history} page="Cuentas Bancarias" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container spacing={4}>
                    {/* CLIENT LIST */}
                    
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