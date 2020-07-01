import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import foto from '../images/Valvulas.png'
import {Layout} from './Layout'
import {FormSignIn} from '../components/FormSignIn'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0
  },
  image: {
    backgroundColor:theme.palette.secondary.main
  },
  img:{
    objectFit:'cover',
    width:"100%",
    height:"100%",
    filter: 'grayscale(0.5) drop-shadow(2px 4px 6px black)'
  },
  paper: {
    width:"100%",
    height:"100%",
    backgroundColor:theme.palette.type==='dark'?theme.palette.secondary.main:theme.palette.primary.main,
    borderRadius:'0',
    display:'flex',
    alignItems:'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    '& .MuiOutlinedInput-input':{
      color:theme.palette.primary.contrastText,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
      borderColor: theme.palette.primary.contrastText
    },
    '& .MuiFormLabel-root.Mui-focused':{
      color:theme.palette.secondary.contrastText
    },
    '& .MuiOutlinedInput-notchedOutline':{
      borderColor: theme.palette.secondary.dark,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color:theme.palette.primary.contrastText,
    '&.MuiButton-outlined':{
      border: `1px solid ${theme.palette.primary.contrastText}`
    },
  },
  background:{
    background:theme.palette.primary.main,
    color:theme.palette.primary.contrastText
  },
  link:{
    color:theme.palette.primary.contrastText
  }
}));


export const SignInPage=({history})=> {
    const classes = useStyles();
    return (
      <Layout hiddenAppBar={true}>
        <Grid container className={classes.root}>
            <Grid item xs={false} sm={5} md={7} className={classes.image}>
              <img src={foto} alt="" className={classes.img}/>
            </Grid>
            <Grid item xs={12} sm={7} md={5}>
              <Paper elevation={6} className={classes.paper}>
                <FormSignIn history={history}/>
              </Paper>
          </Grid>
        </Grid>
      </Layout>
    );
}