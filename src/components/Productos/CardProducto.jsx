import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,CardHeader,CardMedia,Menu,MenuItem,makeStyles,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails,Paper,List,ListItem,ListItemText} from '@material-ui/core'
import {MoreVert,ExpandMore} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {Link} from 'react-router-dom'
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
        color:theme.palette.primary.contrastText,
        textDecoration:'none'
    }
}))
export const CardProducto = ({precio,cantidad,search,name,eliminarProducto,colores}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:name.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                <Card className={classes.card}>
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
                                            pathname:'/Editar-Producto',
                                            props:{producto:name}
                                        }}
                                    >
                                        <MenuItem>Editar</MenuItem>
                                    </Link>
                                    <MenuItem className={classes.deleteButton} onClick={()=>{
                                        setAnchorEl(null)
                                        eliminarProducto()
                                    }}>Eliminar</MenuItem>
                                </Menu>
                            </>
                        }
                        title={name}
                    />
                    <CardContent>
                        <Typography variant="body1">
                            $ {formatMoney(precio)}
                        </Typography>
                        {cantidad &&
                            <Chip
                                label={cantidad}
                            />
                        }
                    </CardContent>
                </Card>
        </Grid>
    )
}
