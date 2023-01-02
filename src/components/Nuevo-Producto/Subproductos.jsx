import React from 'react'
import {Card,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

export const Subproductos = ({subproductos,seteditIndex,showDialog,openDialogDelete}) =>{

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Card style={{width:'300px'}}>
            <Paper elevation={3}>
                <List>
                    {console.log(subproductos)}
                    {subproductos.map((subproducto,i)=>(
                        <ListItem>
                            <ListItemText primary={subproducto.nombre} secondary={subproducto.cantidad}/>
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