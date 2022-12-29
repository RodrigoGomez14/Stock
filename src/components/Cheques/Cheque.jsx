import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Chip,InputLabel,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Select,Input, CardActions, Divider} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess, Add} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Cheque = ({cheque,search,guardarChequeRebotado,id,guardarChequeEnGrupo}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [facturacion,setFacturacion]=useState(false)
    const [expanded, setExpanded] = useState(false);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <>
            <Grid item xs={11} sm={8} md={6} lg={4} className={!search?null:(cheque.numero).search(search) == -1 ? classes.displayNone:classes.display}>
                    <Card>
                        <Paper elevation={3} className={cheque.dadoDeBaja?classes.cardChequeHeaderBaja:(cheque.destinatario?classes.cardChequeEnviadoHeader:classes.cardChequeHeader)}>
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
                                            {!cheque.grupo?
                                                <>
                                                    <MenuItem onClick={()=>{
                                                        guardarChequeEnGrupo(id,'Blanco')
                                                        setAnchorEl(null)
                                                    }}>
                                                        Guardar Blanco
                                                    </MenuItem>
                                                    <MenuItem onClick={()=>{
                                                        guardarChequeEnGrupo(id,'Negro')
                                                        setAnchorEl(null)
                                                    }}>
                                                        Guardar Negro
                                                    </MenuItem>
                                                </>
                                                :
                                                null
                                            }
                                            {!cheque.dadoDeBaja?
                                                <MenuItem onClick={()=>{
                                                    guardarChequeRebotado(id)
                                                    setAnchorEl(null)
                                                }}>
                                                    Dar de Baja
                                                </MenuItem>
                                                :
                                                null
                                        }
                                        </Menu>
                                    </>
                                }
                                title={
                                    <Grid container xs={12} justify='flex-start' spacing={3}>
                                        <Grid item>
                                               Nº {cheque.numero} 
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                className={classes.cardChequeChip}
                                                variant="outlined"
                                                color="primary"
                                                icon={<AttachMoney/>}
                                                label={cheque.valor?formatMoney(cheque.valor):formatMoney(0)}
                                            />
                                        </Grid>
                                    </Grid>
                                }
                                subheader={cheque.vencimiento}
                            />
                            
                        </Paper>
                        <Collapse in={expanded} timeout='auto' unmountOnExit>
                            <CardContent>
                                <Grid container xs={12} spacing={3}>
                                    {cheque.dadoDeBaja?
                                        <Grid container item xs={12}>
                                            <Alert variant="filled" severity="error" className={classes.alertCheque}>
                                                Cheque Dado De Baja
                                            </Alert>
                                        </Grid>
                                        :
                                        null
                                    }
                                    {cheque.destinatario?
                                        <Grid container item xs={12}>
                                            <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                                Entregado a <Link 
                                                                style={{color:'#fff',textDecoration:'none'}}
                                                                className={classes.textWhite}
                                                                to={{pathname:'/Proveedor',search:`${cheque.nombre}`}
                                                            }>{cheque.destinatario}</Link> el {cheque.egreso}
                                            </Alert>
                                        </Grid>
                                        :
                                        null
                                    }
                                </Grid>
                                <List>
                                    {cheque.grupo?
                                        <ListItem>
                                            <ListItemText primary={cheque.grupo} secondary='Grupo'/>
                                        </ListItem>
                                        :
                                        null
                                    }
                                    <Link 
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={classes.textWhite}
                                        to={{pathname:'/Cliente',search:`${cheque.nombre}`}
                                    }>
                                        <ListItem>
                                            <ListItemText primary={cheque.nombre} secondary='Entregado por'/>
                                        </ListItem>
                                    </Link>
                                    <ListItem>
                                        <ListItemText primary={cheque.ingreso} secondary='Fecha de Entrega'/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={cheque.vencimiento} secondary='Vencimiento'/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={cheque.banco} secondary='Banco'/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
        </>
    )
}