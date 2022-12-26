import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,CardHeader,Collapse,Menu,MenuItem,makeStyles,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails,Paper,List,ListItem,ListItemText} from '@material-ui/core'
import {MoreVert,ExpandMore,ExpandLess} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {Link} from 'react-router-dom'
import {content} from '../..//Pages/styles/styles'
export const CardProducto = ({precio,cantidad,search,name,eliminarProducto,subproductos}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // MENU DESPLEGABLE
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // CONTENT
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:name.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                <Card>
                    <CardHeader
                        className={classes.cardCliente}
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
                                    <Link
                                        className={classes.link}
                                        style={{color:'#fff',textDecoration:'none'}}
                                        to={{
                                            pathname:'/Editar-Producto',
                                            search:`${name}`,
                                            props:{producto:name}
                                        }}
                                    >
                                        <MenuItem>Editar</MenuItem>
                                    </Link>
                                    <MenuItem onClick={()=>{
                                        setAnchorEl(null)
                                        eliminarProducto()
                                    }}>Eliminar</MenuItem>
                                </Menu>
                            </>
                        }
                        title={[name,<Chip color='inherit' label={cantidad} style={{marginLeft:'8px'}}/>]}
                        subheader={`$ ${formatMoney(precio)} c/u`}

                    />
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                        <CardContent>
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                    <Grid item xs={12}>
                                        {subproductos?
                                            <List>
                                                {Object.keys(subproductos).map(key=>(
                                                    <ListItem>
                                                        <ListItemText primary={key} secondary={subproductos[key]}
                                                        />
                                                    </ListItem> 
                                                ))}
                                            </List>
                                            :
                                            null
                                        }
                                    </Grid>
                                </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
        </Grid>
    )
}
