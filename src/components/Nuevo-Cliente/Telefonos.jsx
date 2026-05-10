import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton } from '@mui/material'
import {EditOutlined,DeleteOutlineOutlined} from '@mui/icons-material'

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
