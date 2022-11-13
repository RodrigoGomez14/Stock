import React, {useState,useEffect} from 'react'
import {Grid,makeStyles,Paper,Typography,List,ListItem,ListItemText} from '@material-ui/core'
const useStyles = makeStyles(theme=>({
    card:{
        minHeight:'180px',
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    header:{
        '& .MuiTypography-h5':{
            fontSize:'1.3rem'
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    deleteButton:{
        color:theme.palette.error.main
    },
    paper:{
        overflow:'auto'
    }
}))
export const Compras = ({list}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const calcularTotal =() =>{
        
    }
    return(
        <Grid item xs={12} sm={6}>
            {console.log(list)}
                <Paper className={classes.paper}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography> Compras</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <List>
                                <ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem><ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
        </Grid>
    )
}
