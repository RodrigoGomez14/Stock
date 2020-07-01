import React from 'react'
import {List,Paper,ListItem,ListItemText,makeStyles,Typography,Button,Grid} from '@material-ui/core'
import {AddOutlined,EditOutlined} from '@material-ui/icons'
const useStyles = makeStyles(theme=>({
    divider:{
        width:'100%'
    },
    detalles:{
        height:'calc(100vh - 100px)',
        overflowY:'scroll',
        padding:theme.spacing(1)
    },
}))
export const Detalles = ({info}) =>{
    const classes = useStyles()
    return(
        <Grid item xs={12}>
            <Paper elevation={6} className={classes.detalles}>
                <Grid container>
                    <Grid item xs={12} justify='center'>
                        <Button variant='contained' startIcon={<EditOutlined/>}>
                            Editar
                        </Button>
                    </Grid>    
                </Grid>

                {info?
                    <List>
                        {Object.keys(info).map(key=>(
                            <>
                                <ListItem>
                                    <ListItemText primary={key}/>
                                </ListItem>
                                {info[key].map(dato=>(
                                    <ListItem>
                                        <ListItemText primary={dato}/>
                                    </ListItem>
                                ))}
                                <hr clasName={classes.divider}/>
                            </>
                        ))}
                    </List>
                    :
                    <Typography variant='h6'>
                        No hay informacion del cliente
                    </Typography>
                }
            </Paper>
        </Grid>
    )
}