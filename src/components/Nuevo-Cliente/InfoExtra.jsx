import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

export const InfoExtra = ({infoExtra,seteditIndex,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        console.log(index)
        seteditIndex(index)
        showDialog()
    }
    return (
        <Paper elevation={3} >
            <List>
                {infoExtra.map((info,i)=>(
                    <ListItem>
                        <ListItemText primary={info?info:'-'}/>
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