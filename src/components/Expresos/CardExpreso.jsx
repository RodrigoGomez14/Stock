import React, {useState} from 'react'
import {Grid,Card,IconButton,Menu,Typography,MenuItem,CardHeader} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {content} from '../../Pages/styles/styles'


export const CardExpreso = ({datos,search}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:datos.nombre.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
            <Link 
                style={{color:'#fff',textDecoration:'none'}}
                to={{
                pathname:'/Expreso',
                search:`${datos.nombre}`
            }}>
                <Card className={classes.cardCliente}>
                    <CardHeader
                        title={
                            <Typography variant="h5" className={classes.titleCardCliente}>
                                {datos.nombre}
                            </Typography>
                        }/>
                </Card>
        </Link>
    </Grid>
    )
}
            