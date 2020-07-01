import React from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper} from '@material-ui/core'


const useStyles=makeStyles(theme=>({
    root:{
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:theme.palette.type==='dark'?theme.palette.secondary.main:theme.palette.primary.dark,
        borderRadius:'0',
        overflow:'auto',
    }
}))
const Menu=(props)=>{
    const classes = useStyles()
    return(
        <Layout history={props.history} page="Menu" user={props.user.uid}>
            <Paper className={classes.root}>
                <h1>Inicio</h1>
            </Paper>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
    }
}
export default connect(mapStateToProps,null)(Menu)