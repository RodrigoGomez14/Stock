import React, { useState } from 'react'
import {Layout} from './Layout'
import {connect} from 'react-redux'
import {ListConfig} from '../components/ListConfig'
import {database}from 'firebase'
import {makeStyles,Paper,Typography} from '@material-ui/core'
const useStyles=makeStyles(theme=>({
    root:{
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space.around',
        backgroundColor:theme.palette.type==='dark'?theme.palette.secondary.main:theme.palette.primary.dark,
        borderRadius:'0'
    },
    firstPaper:{
        width:'100%',
        display:'flex',
        justifyContent:'center',
        marginTop: theme.spacing(2)
    },
    paper:{
        padding : theme.spacing(3),
        display:'flex',
        flexDirection:'column',
    },
    button:{
        marginTop:theme.spacing(2),
        marginBottom:theme.spacing(2)
    }
}))
const Configuracion=(props)=>{
    let [switchModoOscuro,setSwitchModoOscuro]= useState(localStorage.getItem('theme')==='dark'?true:false)
    const setSwitchValue=value=>{
        setSwitchModoOscuro(value)
        if(!value){
            props.setTheme('light')
            localStorage.setItem('theme','light')
        }
        else{
            props.setTheme('dark')
            localStorage.setItem('theme','dark')
        }
    }
    const cambiarHoraDeInicio=horaDeInicio=>{
        database().ref().child(props.user.uid).update({
            horaDeInicio:horaDeInicio
        })
    }
    const cambiarPeriodo=periodo=>{
        database().ref().child(props.user.uid).update({
            periodo:periodo
        })
    }
    const cambiarCicloLuminico=cicloLuminico=>{
        database().ref().child(props.user.uid).update({
            cicloLuminico:cicloLuminico
        })
    }
    const classes = useStyles()
    return(
        <Layout history={props.history} page='Configuracion' userVerification={props.user.emailVerified} user={props.user.uid}>
            <Paper className={classes.root}>
                {!props.user.emailVerified?
                    <div className={classes.firstPaper}>
                        <Paper elevation={3} className={classes.paper}>
                            <Typography variant='h4'>
                                Verifica tu cuenta de correo!
                            </Typography>
                            <Typography variant='body1'>
                                Para Comenzar a utilizar el Asistente de Cultivo debes completar la configuracion inicial
                            </Typography>
                            <Typography variant='body1'>
                                Luego verifica la direccion de mail ingresada y listo! podras empezar a disfrutar del Asistente.
                            </Typography>
                            <Typography variant='caption'>
                                Una vez verificada, recarga la pagina y ya estara todo listo!
                            </Typography>
                        </Paper>
                    </div>
                    :
                    null
                }
                <ListConfig
                    user={props.user.uid}
                    switchValue={switchModoOscuro} 
                    setSwitchValue={setSwitchValue} 
                    horaDeInicio={props.horaDeInicio}
                    cambiarHoraDeInicio={cambiarHoraDeInicio}
                    periodo={props.periodo} 
                    cambiarPeriodo={cambiarPeriodo}
                    cicloLuminico={props.cicloLuminico}
                    cambiarCicloLuminico={cambiarCicloLuminico}
                    plantas={props.plantas}
                    returnHome={()=>{props.history.replace('/Configuracion')}}
                />
            </Paper>
        </Layout>
    )
}
const mapStateToProps = state=>({
    user:state.user,
    plantas:state.data.plantas,
    periodo:state.data.periodo,
    horaDeInicio:state.data.horaDeInicio,
    cicloLuminico:state.data.cicloLuminico
})
export default connect(mapStateToProps,null)(Configuracion)