import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Chip,InputLabel,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Select,Input, CardActions, Divider} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess, Add} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Cheque = ({cheque,search,guardarChequeRebotado,id}) =>{
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
                                            
                                            <MenuItem>Editar</MenuItem>
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
                                            <MenuItem onClick={()=>{
                                                setAnchorEl(null)
                                            }}>
                                                Eliminar
                                            </MenuItem>
                                        </Menu>
                                    </>
                                }
                                title={
                                    <Grid container xs={12} justify='flex-start' spacing={3}>
                                        <Grid item>
                                            <Link 
                                                style={{color:'#fff',textDecoration:'none'}}
                                                className={classes.textWhite}
                                                to={{pathname:'/Cliente',search:`${cheque.nombre}`}
                                            }>
                                                {cheque.nombre} 
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                className={classes.cardDeudaGreen}
                                                variant="outlined"
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
                                {cheque.dadoDeBaja?
                                    <Alert variant="filled" severity="error">
                                        Cheque Dado De Baja
                                    </Alert>
                                    :
                                    null
                                }
                                {cheque.destinatario?
                                    <>
                                        <Divider/>
                                        <Alert variant="filled" severity="success">
                                            <ListItem>
                                                <ListItemText primary={
                                                    <Link 
                                                        style={{color:'#fff',textDecoration:'none'}}
                                                        className={classes.textWhite}
                                                        to={{pathname:'/proveedor',search:`${cheque.destinatario}`}
                                                    }>
                                                    {cheque.destinatario} 
                                                </Link>
                                                } secondary={cheque.egreso}/>
                                            </ListItem>
                                        </Alert>
                                    </>
                                    :
                                    null
                                }
                                <List>
                                    <ListItem>
                                        <ListItemText primary={cheque.ingreso} secondary='Fecha de Entrega'/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={cheque.vencimiento} secondary='Vencimiento'/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={cheque.banco} secondary='Banco'/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={cheque.numero} secondary='Numero'/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
        </>
    )
}