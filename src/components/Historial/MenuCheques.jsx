import React,{useState} from 'react'
import {Button,Menu,MenuItem,Divider,makeStyles,IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {ArrowDropDown} from '@material-ui/icons'

const useStyles = makeStyles(theme=>({
    link:{
        textDecoration:'none',
        color:theme.palette.primary.contrastText
    }
}))
export const MenuCheques = ({pago}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    return(
        pago.cheques.length?
            <>
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <ArrowDropDown/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pago.cheques.map(cheque=>(
                        <Link
                            className={classes.link} 
                            to={{
                                pathname:'/Cheques',
                                search:cheque
                            }}
                        >
                                <MenuItem>{cheque}</MenuItem>
                        </Link>
                    ))}
                </Menu>
            </>
            :
            '-'
    )
}