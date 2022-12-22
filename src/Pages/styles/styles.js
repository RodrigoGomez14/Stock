import {makeStyles,Paper} from '@material-ui/core'

//STYLES
export const content =makeStyles(theme=>({
    //LAYOUT
    content: {
        flexGrow: 1,
        height:'calc(100vh - 64px)',
        marginTop:theme.spacing(8),
        marginRight:theme.spacing(7),
        paddingTop:theme.spacing(2),
        paddingLeft:theme.spacing(2),
        paddingRight:theme.spacing(2),
        backgroundColor:theme.palette.secondary.main,
        overflow:'scroll',
    },
    stepper:{
        backgroundColor:'transparent'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    display:{
        display:'block'
    },
    displayNone:{
        display:'none'
    },
    // CLIENTE
    paperCliente:{
        width:'300px',
        height:'200px',
        overflow:'scroll'
    },
    containerDetallesCliente:{
        overflow:'scroll',
        flexWrap:'nowrap'
    },
    titleDetallesCard:{
        backgroundColor:theme.palette.primary.main
    },
    cardDeudaGreen:{
        backgroundColor:theme.palette.success.main,
        width:'300px',
    },
    cardDeudaRed:{
        backgroundColor:theme.palette.danger.main,
        width:'300px',
    },

        // CARD CLIENT
        cardCliente:{
            backgroundColor:theme.palette.primary.main,
            width:'300px'
        },
        titleCardCliente:{
            color: theme.palette.primary.contrastText,
            textDecoration:'none',
            textAlign:'center'
        },
        chipCardDangerCliente:{
            backgroundColor:theme.palette.danger.main,
            cursor:'pointer'
        },
        chipCardSuccessCliente:{
            backgroundColor:theme.palette.success.main,
            cursor:'pointer'
        },
    
    // CARD PEDIDO
    cardPedidoHeader:{
        backgroundColor:theme.palette.primary.main
    },
    cardPedidoActions:{
        backgroundColor:theme.palette.primary.dark
    },
    // NUEVO-PEDIDO
    cardTotalPedidoDanger:{
        padding:'15px',
        backgroundColor:theme.palette.danger.main
    },
    cardTotalPedidoSuccess:{
        padding:'15px',
        backgroundColor:theme.palette.success.main
    },
    
    //CARD PRODUCTO
    cardProducto:{
        backgroundColor:theme.palette.primary.main,
        width:'300px'
    },
    cardProductoChip:{
        backgroundColor:theme.palette.info.main,
        color:theme.palette.info.contrastText
    },

    //ENVIAR PEDIDO
    paperTotalEnviarPedido:{
        backgroundColor:theme.palette.success.main,
        color:theme.palette.success.contrastText,
        padding:'20px'
    },
    //RECIBIR ENTREGA
    paperTotalRecibirEntrega:{
        backgroundColor:theme.palette.danger.main,
        color:theme.palette.danger.contrastText,
        padding:'20px'
    },

    //NUEVO CLIENTE 
    iconLabelSelected:{
        backgroundColor:`${theme.palette.primary.main} !important`
    },
}))