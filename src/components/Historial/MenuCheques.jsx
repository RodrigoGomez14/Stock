import React,{useState} from 'react'
import {Button,Menu,MenuItem,Divider,makeStyles,IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {ArrowDropDown} from '@material-ui/icons'
import { formatMoney } from '../../utilities'

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

    const calcularTotal = (total,efectivo) =>{
        const auxEfectivo = efectivo?efectivo:0
        return total-auxEfectivo!=0?total-auxEfectivo:0
    }
    return(
        pago.cheques?
            <>
                <Button onClick={handleClick} startIcon={<ArrowDropDown/>}>
                    {formatMoney(calcularTotal(pago.pagado,pago.efectivo))}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pago.cheques.map(cheque=>(
                        <Link
                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
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
            '$ -' 
    )
}