import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,makeStyles, List,ListItem, ListItemText} from '@material-ui/core'
import {MoreVert,AttachMoney} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'

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
        textDecoration:'none',
        color:theme.palette.primary.contrastText
    },
    footer:{
        display:'flex',
        justifyContent:'space-between'
    },
    paper:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1),
    },
    textWhite:{
        color:theme.palette.primary.contrastText,
        textDecoration:'none'
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
}))

export const CardEntrega = ({entrega,id,eliminarEntrega,deuda}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Grid item xs={11} sm={8} md={6} lg={4} >
            <Card className={classes.card}>
                <Paper elevation={3}>
                    <CardHeader
                        className={classes.header}
                        action={
                            <>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVert/>
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    >   
                                    <Link 
                                        className={classes.link}
                                        to={{
                                        pathname:'/Editar-Entrega',
                                        search:`${id}`
                                    }}>
                                        <MenuItem>Editar</MenuItem>
                                    </Link>
                                    <MenuItem className={classes.deleteButton} onClick={()=>{
                                        setAnchorEl(null)
                                        eliminarEntrega()
                                    }}>
                                        Eliminar
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                        title={
                            <Link 
                                className={classes.textWhite}
                                to={{pathname:'/Proveedor',search:`${entrega.proveedor}`}
                            }>
                                {entrega.proveedor} 
                                <Chip
                                    className={deuda>0?classes.danger:classes.success}
                                    variant="outlined"
                                    icon={<AttachMoney className={deuda>0?classes.iconDanger:classes.iconSuccess} />}
                                    label={deuda?formatMoney(deuda):formatMoney(0)}
                                />
                            </Link>}
                        subheader={entrega.fecha}
                    />
                </Paper>
                <CardContent>
                    <List>
                        {entrega.productos.map(producto=>(
                            <ListItem>
                                <ListItemText primary={producto.producto} secondary={producto.cantidad}/>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
                <Paper elevation={6} className={classes.paper}>
                    <Grid container justify='space-around'>
                        <Typography variant='h5'>
                            $ {formatMoney(entrega.total)}
                        </Typography>
                        <Link 
                            className={classes.textWhite}
                            to={{pathname:'/Recibir-Entrega',search:`${id}`,props:{total:entrega.total}}
                        }>
                            <Button
                                variant='outlined'
                            >
                                Recibir Entrega 
                            </Button>
                        </Link>
                    </Grid>
                </Paper>
            </Card>
        </Grid>
    )
}
