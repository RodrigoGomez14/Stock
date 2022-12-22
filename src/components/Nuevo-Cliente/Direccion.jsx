import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,Listaction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'


export const Direccion = ({direcciones,seteditIndex,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Paper elevation={3}>
            <List>
                {direcciones.map((direccion,i)=>(
                    <ListItem>
                        <ListItemText primary={`${direccion.calleYnumero} , ${direccion.ciudad} , ${direccion.provincia} , CP:${direccion.cp}`}/>
                            <IconButton edge="end" aria-label="delete" onClick={()=>{openDialog(i)}}>
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