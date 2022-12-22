import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

export const Telefonos = ({telefonos,seteditIndex,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Paper elevation={3}>
            <List>
                {telefonos.map((telefono,i)=>(
                    <ListItem>
                        <ListItemText primary={telefono.numero} secondary={telefono.nombre?telefono.nombre:'-'}/>
                        <IconButton edge="end" aria-label="edit" onClick={()=>{openDialog(i)}}>
                            <EditOutlined />
                        </IconButton>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={()=>{openDialogDelete(i)}}>
                                <DeleteOutlineOutlined color='error'/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
}