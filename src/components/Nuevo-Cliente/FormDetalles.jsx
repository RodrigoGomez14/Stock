import React from 'react'
import {Grid,Paper,TextField,makeStyles} from '@material-ui/core'
import {DialogNuevaDireccion} from './Dialogs/DialogNuevaDireccion'
import {AddOutlined} from '@material-ui/icons'
import {Direccion} from './Direccion'

const useStyles= makeStyles(theme=>({
    input:{
        marginTop:theme.spacing(1),
        [theme.breakpoints.up('xs')]: {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    paper:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(2),
        padding:theme.spacing(2),
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },
}))
export const FormDetalles = ({nombre,setnombre,dni,setdni,cuit,setcuit})=>{
    const classes = useStyles()
    return(
        <Grid container justify='center'>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper elevation={6} className={classes.paper}>
                    <TextField
                        autoFocus
                        className={classes.input}
                        label='Nombre'
                        value={nombre}
                        onChange={e=>{
                            setnombre(e.target.value)
                        }}
                    />
                    <TextField
                        className={classes.input}
                        value={dni}
                        onChange={e=>{
                            setdni(e.target.value)
                        }}
                        label='DNI'
                    />
                    <TextField
                        className={classes.input}
                        value={cuit}
                        onChange={e=>{
                            setcuit(e.target.value)
                        }}
                        label='CUIT'
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}