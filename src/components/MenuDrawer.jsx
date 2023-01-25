import React from 'react'
import {auth} from 'firebase'
import {Card,CardMedia,Drawer,List,makeStyles,ListItem,IconButton,ListItemIcon,ListItemText,Divider} from '@material-ui/core'
import {MoveToInbox,Home,List as ListIcon,ExitToApp,Link as LinkIcon,AccountBalanceWallet,LocalShipping,ChevronRight,LocalAtm,ShoppingCart, AccountBalance, Contacts} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import logo from '../images/logo.png'
import clsx from 'clsx';


const useStyles = makeStyles(theme=>({
    link:{
        textDecoration:'none !important',
        color:theme.palette.primary.contrastText
    },
      drawer: {
        width: '240px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      },
      drawerOpen: {
        width: '240px',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.down('xs')]: {
          width: 0,
        },
      },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        height:theme.spacing(8),
        justifyContent: 'flex-start',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      },
      buttonSignOut:{
          flex:1,
          display:'flex',
          flexDirection:'column',
          justifyContent:'flex-end'

      }
}))

//FUNCTIONS 

const checkSelected = (icon,page) =>{
    if(icon==page){
        return true
    }
    else if(icon=='Inicio' && page== ''){
        return true
    }
    // PRODUCTOS
    else if(icon==='Productos' && (page=='Nuevo-Producto' || page=='Editar-Producto')){
        return true
    }
    // PEDIDOS
    else if(icon==='Pedidos' && (page=='Enviar-Pedido' || page=='Editar-Pedido')){
        return true
    }
    // ENTREGAS
    else if(icon==='Entregas' && (page=='Recibir-Entrega' || page=='Editar-Entrega')){
        return true
    }
    // CLIENTES
    else if(icon==='Clientes'&& (page=='Nuevo-Cliente'||page=='Editar-Cliente'||page.slice(0,7)=='Cliente'||page.slice(0,17)=='Historial-Cliente')){
        return true
    }
    // PROVEEDORES
    else if(icon==='Proveedores'&& (page=='Nuevo-Proveedor'||page=='Editar-Proveedor'||page.slice(0,9)=='Proveedor'||page.slice(0,19)=='Historial-Proveedor')){
        return true
    }
    // EXPRESOS
    else if(icon==='Expresos'&& (page=='Nuevo-Expreso'||page=='Editar-Expreso'||page.slice(0,7)=='Expreso')){
        return true
    }
    // CADENAS DE PRODUCCION
    else if(icon==='Cadenas De Produccion'&& (page.slice(0,23)=='Historial De Produccion'||page=='Finalizar Proceso')){
        return true
    }
    else{
        return false
    }
}
export const MenuDrawer = ({menuOpened,setMenuOpened,history,page})=>{
    const classes = useStyles()
    return(
        <Drawer 
            anchor='right'
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: menuOpened,
                [classes.drawerClose]: !menuOpened,
            })}
            classes={{
                paper: clsx({
                [classes.drawerOpen]: menuOpened,
                [classes.drawerClose]: !menuOpened,
            }),
            }} 
            open={menuOpened}  
            onClose={e=>{setMenuOpened(false)}}>
            <div className={classes.toolbar}>
                <IconButton onClick={()=>{setMenuOpened(false)}}>
                    <ChevronRight /> 
                </IconButton>
            </div>
            <Divider />
            <List>
                <Link className={classes.link} to='/'>
                    <ListItem button key={'Inicio'} selected={checkSelected('Inicio',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <Home/>
                        </ListItemIcon>
                        <ListItemText primary={'Inicio'} />
                    </ListItem>
                </Link>
            <Divider />
                <Link className={classes.link} to='/Productos'>
                    <ListItem button key={'Productos'} selected={checkSelected('Productos',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <ListIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>
                </Link>
                <Divider />
                <Link className={classes.link} to='/Pedidos'>
                    <ListItem button key={'Pedidos'} selected={checkSelected('Pedidos',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <MoveToInbox/>
                        </ListItemIcon>
                        <ListItemText primary={'Pedidos'} />
                    </ListItem>
                </Link>
            <Divider />
                <Link className={classes.link} to='/Entregas'>
                    <ListItem button key={'Entregas'} selected={checkSelected('Entregas',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <MoveToInbox/>
                        </ListItemIcon>
                        <ListItemText primary={'Entregas'} />
                    </ListItem>
                </Link>
            <Divider />
                <Link className={classes.link} to='/Clientes'>
                    <ListItem button key={'Clientes'} selected={checkSelected('Clientes',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <Contacts/>
                        </ListItemIcon>
                        <ListItemText primary={'Clientes'} />
                    </ListItem>
                </Link>
            <Divider />
                <Link className={classes.link} to='/Proveedores'>
                    <ListItem button key={'Proveedores'} selected={checkSelected('Proveedores',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <Contacts/>
                        </ListItemIcon>
                        <ListItemText primary={'Proveedores'} />
                    </ListItem>
                </Link>
            <Divider />
                <Link className={classes.link} to='/Expresos'>
                    <ListItem button key={'Expresos'} selected={checkSelected('Expresos',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <LocalShipping/>
                        </ListItemIcon>
                        <ListItemText primary={'Expresos'} />
                    </ListItem>
                </Link>
            <Divider />
            <Link className={classes.link} to='/Deudas'>
                <ListItem button key={'Deudas'} selected={checkSelected('Deudas',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <AccountBalanceWallet/>
                        </ListItemIcon>
                        <ListItemText primary={'Deudas'} />
                    </ListItem>
                </Link>
            <Divider />
            <Link className={classes.link} to='/Cheques'>
                <ListItem button key={'Cheques'} selected={checkSelected('Cheques',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <LocalAtm/>
                        </ListItemIcon>
                        <ListItemText primary={'Cheques'} />
                    </ListItem>
                </Link>
            <Divider />
            <Link className={classes.link} to='/Cuentas-Bancarias'>
                <ListItem button key={'Cuentas Bancarias'} selected={checkSelected('Cuentas-Bancarias',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <AccountBalance/>
                        </ListItemIcon>
                        <ListItemText primary={'Cuentas Bancarias'} />
                    </ListItem>
                </Link>
            <Divider />
            </List>
            <List className={classes.buttonSignOut}>
                <Divider />
                <Link className={classes.link} to='/Cadenas-De-Produccion'>
                    <ListItem button key={'Cadenas De Produccion'} selected={checkSelected('Cadenas-De-Produccion',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <LinkIcon/>
                        </ListItemIcon>
                        <ListItemText  primary={'Cadenas de Produccion'} />
                    </ListItem> 
                </Link>
                <Divider />
                <Link className={classes.link} to='/Nuevo-Pedido'>
                    <ListItem button key={'Nuevo Pedido'} selected={checkSelected('Nuevo-Pedido',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <ShoppingCart/>
                        </ListItemIcon>
                        <ListItemText  primary={'Nuevo Pedido'} />
                    </ListItem> 
                </Link>
                <Divider />
                <Link className={classes.link} to='/Nueva-Entrega'>
                    <ListItem button key={'Nueva Entrega'} selected={checkSelected('Nueva-Entrega',history.location.pathname.slice(1))}>
                        <ListItemIcon>
                            <ShoppingCart/>
                        </ListItemIcon>
                        <ListItemText  primary={'Nueva Entrega'} />
                    </ListItem>    
                </Link>
                <Divider />
                <ListItem button key={'Cerrar sesion'}  onClick={()=>{
                    history.replace('/')
                    auth().signOut()
                }} >
                    <ListItemIcon>
                        <ExitToApp color='error'/>
                    </ListItemIcon>
                    <ListItemText  primary={'Cerrar sesion'} />
                </ListItem>    
            </List>
        </Drawer>
    )
}