import React from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography,Button,Card,CardHeader,CardContent,List,ListItem,ListItemText} from '@material-ui/core'
import Empty from '../images/Empty.png'
import {Cadena} from '../components/Cadenas-De-Produccion/Cadena'

//COMPONENT
const CadenasDeProduccion=(props)=>{
    const classes = content()
    return(
        //Layout
        <Layout history={props.history} page="Cadenas De Produccion" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={2}>
                    <Grid container item xs={12} justify='center'>
                        <Button
                            variant='contained'
                            color='primary'
                        >
                            Iniciar Cadena de Produccion
                        </Button>
                    </Grid>
                    {props.cadenasActivas?
                        Object.keys(props.cadenasActivas).map(cadena=>(
                            <Cadena cadena={props.cadenasActivas[cadena]}/>
                        ))
                        :
                        <Grid container xs={12} justify='center' spacing={2}>
                            <Grid item>
                                <img src={Empty} alt="" height='500px'/>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h5'>No hay Cadenas de Produccion Activas</Typography>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </Layout>
    )
}

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        cadenasActivas:state.cadenasActivas
    }
}
export default connect(mapStateToProps,null)(CadenasDeProduccion)