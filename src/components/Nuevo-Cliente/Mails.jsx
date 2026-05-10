import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton } from '@mui/material'
import {EditOutlined,DeleteOutlineOutlined} from '@mui/icons-material'

export const Mails = ({mails,seteditIndex,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Paper elevation={3}>
            <List>
                {mails.map((mail,i)=>(
                    <ListItem>
                        <ListItemText primary={mail.mail} secondary={mail.nombre?mail.nombre:'-'}/>
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
