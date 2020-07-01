import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

const useStyles = makeStyles(theme=>({
    root:{
        minWidth:'230px'
    },
    icon:{
        marginLeft:theme.spacing(1),
        marginRight:theme.spacing(1)
    }
}))
export const Telefonos = ({telefonos,seteditIndex,showDialog,openDialogDelete}) =>{
    const classes = useStyles()

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Grid item>
            <Paper elevation={3} className={classes.root}>
                <List>
                    {telefonos.map((telefono,i)=>(
                        <ListItem>
                            <ListItemText primary={telefono.numero} secondary={telefono.nombre?telefono.nombre:'-'}/>
                            <IconButton className={classes.icon} edge="end" aria-label="delete" onClick={()=>{openDialog(i)}}>
                                <EditOutlined />
                            </IconButton>
                            <ListItemSecondaryAction>
                                <IconButton className={classes.icon} edge="end" aria-label="delete" onClick={()=>{openDialogDelete(i)}}>
                                    <DeleteOutlineOutlined color='error'/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
    )
}