import React, {useState,useEffect} from 'react'
import {Grid,makeStyles,Paper,Typography,List,ListItem,ListItemText} from '@material-ui/core'
import {Tabla} from './Tabla'
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
export const Ventas = ({data}) =>{
    const classes = useStyles()
    return(
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography align='center'>Ventas</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Tabla data={data} ventas={true}/>
                </Grid>
            </Grid>
        </Paper>
    )
}
