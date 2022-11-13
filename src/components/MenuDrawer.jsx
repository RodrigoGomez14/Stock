import React from 'react'
import {auth} from 'firebase'
import {Card,CardMedia,Drawer,List,makeStyles,ListItem,IconButton,ListItemIcon,ListItemText,Divider} from '@material-ui/core'
import {ContactMailOutlined,MoveToInboxOutlined,Home,List as ListIcon,ExitToAppOutlined,Close,AttachMoneyOutlined,LocalShippingOutlined,ChevronRight,LocalAtmOutlined,ShoppingCartOutlined} from '@material-ui/icons'
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
export const MenuDrawer = ({menuOpened,setMenuOpened,history})=>{
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
        }} open={menuOpened}  onClose={e=>{setMenuOpened(false)}}>
                <div className={classes.toolbar}>
                    <IconButton onClick={()=>{setMenuOpened(false)}}>
                        <ChevronRight /> 
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link className={classes.link} to='/'>
                        <ListItem button key={'Menu'}>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary={'Menu'} />
                        </ListItem>
                    </Link>
                <Divider />
                    <Link className={classes.link} to='/Productos'>
                        <ListItem button key={'Productos'} >
                            <ListItemIcon>
                                <ListIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Productos'} />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link className={classes.link} to='/Pedidos'>
                        <ListItem button key={'Pedidos'} >
                            <ListItemIcon>
                                <MoveToInboxOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Pedidos'} />
                        </ListItem>
                    </Link>
                <Divider />
                    <Link className={classes.link} to='/Entregas'>
                        <ListItem button key={'Entregas'} >
                            <ListItemIcon>
                                <MoveToInboxOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Entregas'} />
                        </ListItem>
                    </Link>
                <Divider />
                    <Link className={classes.link} to='/Clientes'>
                        <ListItem button key={'Clientes'} >
                            <ListItemIcon>
                                <ContactMailOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Clientes'} />
                        </ListItem>
                    </Link>
                <Divider />
                    <Link className={classes.link} to='/Proveedores'>
                        <ListItem button key={'Proveedores'} >
                            <ListItemIcon>
                                <ContactMailOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Proveedores'} />
                        </ListItem>
                    </Link>
                <Divider />
                    <Link className={classes.link} to='/Expresos'>
                        <ListItem button key={'Expresos'} >
                            <ListItemIcon>
                                <LocalShippingOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Expresos'} />
                        </ListItem>
                    </Link>
                <Divider />
                <Link className={classes.link} to='/Deudas'>
                        <ListItem button key={'Deudas'} >
                            <ListItemIcon>
                                <AttachMoneyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Deudas'} />
                        </ListItem>
                    </Link>
                <Divider />
                <Link className={classes.link} to='/Cheques'>
                        <ListItem button key={'Cheques'} >
                            <ListItemIcon>
                                <LocalAtmOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Cheques'} />
                        </ListItem>
                    </Link>
                <Divider />
                <Link className={classes.link} to='/IVA'>
                        <ListItem button key={'IVA'} >
                            <ListItemIcon>
                                <LocalAtmOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'IVA'} />
                        </ListItem>
                    </Link>
                <Divider />
                </List>
                <List className={classes.buttonSignOut}>
                    <Divider />
                    <Link className={classes.link} to='/Nuevo-Pedido'>
                        <ListItem button key={'Nuevo Pedido'} >
                            <ListItemIcon>
                                <ShoppingCartOutlined/>
                            </ListItemIcon>
                            <ListItemText  primary={'Nuevo Pedido'} />
                        </ListItem> 
                    </Link>
                    <Divider />
                    <Link className={classes.link} to='/Nueva-Entrega'>
                        <ListItem button key={'Nueva Entrega'} >
                            <ListItemIcon>
                                <ShoppingCartOutlined/>
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
                            <ExitToAppOutlined color='error'/>
                        </ListItemIcon>
                        <ListItemText  primary={'Cerrar sesion'} />
                    </ListItem>    
                </List>
        </Drawer>
    )
}