import React from 'react'
import {Card,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

export const Matrices = ({matrices,seteditIndexMatriz,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        seteditIndexMatriz(index)
        showDialog()
    }
    return (
        <Card style={{width:'300px'}}>
            <Paper elevation={3}>
                <List>
                    {matrices.map((matriz,i)=>(
                        <ListItem>
                            <ListItemText primary={matriz.nombre} secondary={matriz.ubicacion}/>
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
        </Card>
    )
}