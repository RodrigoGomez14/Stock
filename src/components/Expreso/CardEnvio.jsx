import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Switch,FormControlLabel, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardEnvio = ({envio,search,asentarLlegada,success}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [cardState,setCardState] = useState(success)

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <Grid item xs={11} sm={8} md={6} lg={4} className={!search?null:envio.remito.search(search) == -1 ? classes.displayNone:classes.display} >
            <Card>
                {console.log(envio)}
                <Paper elevation={3} className={cardState?classes.cardEnvioHeaderSuccess:null}>
                    <CardHeader
                        className={classes.header}
                        action={
                            <>
                                <IconButton onClick={()=>{setExpanded(!expanded)}}>
                                    {expanded?
                                        <ExpandLess/>
                                        :
                                        <ExpandMore/>
                                    }
                                </IconButton>
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
                                    {!envio.fechaDeLlegada?
                                        <MenuItem onClick={()=>{
                                            handleClose()
                                            setCardState(true)
                                            asentarLlegada()
                                        }}>Asentar llegada</MenuItem>
                                        :
                                        null
                                    }
                                    <MenuItem className={classes.deleteButton} disabled={true} onClick={()=>{}}>Asentar Inconveniente</MenuItem>
                                </Menu>
                            </>
                        }
                        title={
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                <Grid item>
                                    <Link 
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={classes.textWhite}
                                        to={{pathname:'/Cliente',search:`${envio.cliente}`}
                                    }>
                                        {envio.cliente}
                                    </Link>
                                </Grid>
                            </Grid>
                        }
                        subheader={
                            <Link 
                                style={{color:'#fff',textDecoration:'none'}}
                                className={classes.textWhite}
                                to={{pathname:'/Cliente',search:`${envio.cliente}`,props:{remito:envio.id}}}>
                                Remito Nº {envio.remito}
                            </Link>
                        }
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        {envio.fechaDeLlegada?
                            <Grid container xs={12} justify='center'>
                                <Grid container item xs={12}>
                                    <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                        El paquete llego a destino el {envio.fechaDeLlegada}
                                    </Alert>
                                </Grid>
                            </Grid>
                            :
                            null
                        }
                        <List>
                            <ListItem>
                                <ListItemText primary={envio.fecha} secondary='Fecha de Salida'/>
                            </ListItem>
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}
