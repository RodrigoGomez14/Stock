import React from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Grid,Typography} from '@material-ui/core'
import {Compras} from '../components/Iva/Compras'
import {Ventas} from '../components/Iva/Ventas'


const useStyles=makeStyles(theme=>({
    container:{
        paddingTop:theme.spacing(1),
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        color:theme.palette.success.main,
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        color:theme.palette.danger.main,
        borderColor:theme.palette.danger.main
    },
    grid:{
        display:'flex',
        flexDirection:'column',
        padding:theme.spacing(1),
        height:'calc(100vh - 100px)',
    },
    pedidos:{
        marginTop:theme.spacing(2)
    },
    grow:{
        flexGrow:1
    },
    textWhite:{
        color:theme.palette.primary.contrastText
    },
    pedidosContainer:{
        flexGrow:1
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
}))
const IvaPage=(props)=>{
    const classes = useStyles()
    return(
        <Layout history={props.history} page="Iva" user={props.user.uid}>
            <Grid container justify='center' className={classes.container}>
                <Compras list={props.iva.compras}/>
                <Ventas list={props.iva.ventas}/>
            </Grid>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        iva:state.iva
    }
}
export default connect(mapStateToProps,null)(IvaPage)