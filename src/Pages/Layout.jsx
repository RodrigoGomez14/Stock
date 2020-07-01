import React , {useState} from 'react'
import {Redirect} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {NavBar} from '../components/Navbar'
import {MenuDrawer} from '../components/MenuDrawer'
import {DialogConfirmGoBack} from '../components/Dialogs/DialogConfirmGoBack'

const useStyles = makeStyles(theme => ({
    root: {
      display:'flex',
      overflow:'hidden',
    },
    drawer:{
        maxWidth:'300px',
        height:'100%',
    },
    icon:{
        color:theme.palette.primary.contrastText
    },
    text:{
        color:theme.palette.primary.contrastText
    },
    app:{
        minHeight: '100vh',
        height: '100vh',
        maxHeight:'100vh',
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
    },
    content: {
        flexGrow: 1,
        height:'calc(100vh - 36px)',
        marginTop:theme.spacing(8),
        backgroundColor:theme.palette.secondary.main,
        overflow:'scroll'
    }
}));


export const Layout=({page,children,history,hiddenAppBar,blockGoBack,user})=>{
    const classes = useStyles();
    const [menuOpened,setMenuOpened]=useState(false)
    const [dialogBlockOpen,setdialogBackOpen]=useState(false)
    return(
        <div className={classes.root}>
            <DialogConfirmGoBack blockGoBack={dialogBlockOpen} setBlockGoBack={setdialogBackOpen} history={history}/>
            {!hiddenAppBar&&
                <NavBar page={page} history={history} setMenuOpened={setMenuOpened} menuOpened={menuOpened} blockGoBack={blockGoBack} setBlockGoBack={setdialogBackOpen}/>
            }
            <main className={classes.content}>
                {children}
            </main>
            {!hiddenAppBar&&
                <MenuDrawer menuOpened={menuOpened} setMenuOpened={setMenuOpened} history={history} blockGoBack={blockGoBack} setBlockGoBack={setdialogBackOpen}/>
            }
        </div>
    )
}