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
    link:{
        color:theme.palette.primary.contrastText,
        textDecoration:'none'
    }
}))
export const Ventas = ({list}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <Grid item xs={12} sm={6}>
                <Paper>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography> Ventas</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <List>
                                <ListItem>
                                    <ListItemText primary='$5000'/>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
        </Grid>
    )
}
