import React,{useState} from 'react'
import {Button,Menu,MenuItem,Divider,makeStyles} from '@material-ui/core'
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
                <Button aria-controls="simple-menu" aria-haspopup="true" endIcon={<ArrowDropDown/>} onClick={handleClick}>
                    Ver Cheques 
                </Button>
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