import React,{useState} from 'react'
import { makeStyles } from 'tss-react/mui'
import { Button,Menu,MenuItem,Divider,IconButton } from '@mui/material'
import {Link} from 'react-router-dom'
import {ArrowDropDown} from '@mui/icons-material'
import { formatMoney } from '../../utilities'

const useStyles = makeStyles()((theme) => ({
    link:{
        textDecoration:'none',
        color:theme.palette.primary.contrastText
    }
}))
export const MenuChequesPersonales = ({pago}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return(
        pago.chequesPersonales?
            <>
                <Button onClick={handleClick} startIcon={<ArrowDropDown/>}>
                    {formatMoney(pago.totalChequesPersonales)}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pago.chequesPersonales.map(cheque=>(
                        <Link
                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                            className={classes.link} 
                            to={{
                                pathname:'/Cheques-Personales',
                                search:cheque
                            }}
                        >
                                <MenuItem>{cheque}</MenuItem>
                        </Link>
                    ))}
                </Menu>
            </>
            :
            '$ -' 
    )
}
