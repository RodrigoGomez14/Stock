import React from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography} from '@material-ui/core'
import Home from '../images/Home.png'

//COMPONENT
const CadenasDeProduccion=(props)=>{
    const classes = content()
    return(
        //Layout
        <Layout history={props.history} page="Cadenas De Produccion" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={2}>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h4'>Seccion En Construccion</Typography>
                    </Grid>
                    <Grid item>
                        <img src={Home} alt="" height='600px'/>
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
    }
}
export default connect(mapStateToProps,null)(CadenasDeProduccion)