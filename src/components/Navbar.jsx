import React from 'react'
import {makeStyles} from '@material-ui/core'
import {AppBar,Toolbar,IconButton,Typography} from '@material-ui/core'
import {MenuOpen,ArrowBackRounded} from '@material-ui/icons'
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
const useStyles = makeStyles( theme=>({
    appBar:{
        backgroundColor:theme.palette.primary.main,
        color:theme.palette.primary.contrastText
    },
    menuButton: {
    },
    title: {
        flexGrow: 1,
        textAlign:'center'
    },
    avatar:{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark,
    },
    danger:{
        color:theme.palette.error.main
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        height:theme.spacing(8)
      },
      appBarShift: {
        marginRight: 240,
        width: `calc(100% - ${240}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: 18,
      },
      hide: {
        display: 'none',
      },
}))

export const NavBar = ({page,history,setMenuOpened,menuOpened,blockGoBack,setBlockGoBack}) =>{
    const classes = useStyles()
    return(
        <AppBar position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: menuOpened,
        })} >
            <Toolbar>
            {!menuOpened &&
              page!=='Menu'&&
                  <IconButton edge="end" onClick={e=>{
                      blockGoBack?setBlockGoBack(true):history.goBack()
                  }} color="inherit" aria-label="menu">
                      <ArrowBackRounded />
                  </IconButton>
            }
            <Typography variant="h6" className={classes.title} >
                {page}
            </Typography>
            {!menuOpened &&
                <IconButton edge="end" className={clsx(classes.menuButton, {
                    [classes.hide]: menuOpened,
                  })} onClick={e=>{
                    setMenuOpened(true)
                }} color="inherit" aria-label="menu">
                    <MenuOpen />
                </IconButton>
            }
            </Toolbar>
        </AppBar>
    )
}