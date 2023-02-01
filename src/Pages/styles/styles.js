import {CardHeader, makeStyles,Paper} from '@material-ui/core'

//STYLES
export const content =makeStyles(theme=>({
    cardBgGreen:{
        backgroundColor:theme.palette.success.main
    },
    cardBgRed:{
        backgroundColor:theme.palette.danger.main
    },
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
        width:'100%',
    },
    cardDeudaRed:{
        backgroundColor:theme.palette.danger.main,
        width:'100%',
    },

        // CARD CLIENT
        cardCliente:{
            backgroundColor:theme.palette.primary.main,
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
    containerProductos:{
        overflow:'scroll',
        flexWrap:'nowrap'
    },
    cardDeudaRedCardPedido:{
        backgroundColor:theme.palette.danger.main
    },
    cardDeudaGreenCardPedido:{
        backgroundColor:theme.palette.success.main
    },
    alertPedidoFacturado:{
        width:'100%',
        color:'#000 !important'
    },
    alertEnvioInconveniente:{
        width:'100%',
        color:'#000 !important'
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
    // CARD ENVIO
    cardEnvioHeader:{
        backgroundColor:theme.palette.primary.main
    },
    cardEnvioHeaderSuccess:{
        backgroundColor:theme.palette.success.main
    },
    cardEnvioHeaderDanger:{
        backgroundColor:theme.palette.danger.dark
    },
    cardEnvioHeaderWarning:{
        backgroundColor:theme.palette.warning.main,
        color:'#000 !important'
    },
    cardEnvioHeaderTextSuccess:{
        color:'#fff',
        textDecoration:'none',
    },
    cardEnvioHeaderTextWarning:{
        color:'#000',
        textDecoration:'none',    
    },
    cardEnvioHeaderIconSuccess:{
        color:'#fff',
    },
    cardEnvioHeaderIconWarning:{
        color:'#000',
    },
    
    //CARD PRODUCTO
    cardProducto:{
        backgroundColor:theme.palette.primary.main,
        width:'300px'
    },
    cardProductoChipAdeudado:{
        backgroundColor:theme.palette.danger.main,
        color:theme.palette.danger.contrastText
    },
    cardProductoChipAfavor:{
        backgroundColor:theme.palette.success.main,
        color:theme.palette.success.contrastText
    },

    //ENVIAR PEDIDO
    paperTotalEnviarPedido:{
        backgroundColor:theme.palette.success.main,
        color:theme.palette.success.contrastText,
        padding:'20px'
    },

    totalProductoNuevoPedido:{
        backgroundColor:theme.palette.primary.main,
        width:'100%'
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

    // CARD CHEQUE
    cardChequeHeader:{
    },
    cardChequeHeaderBaja:{
        backgroundColor:theme.palette.danger.light
    },
    cardChequeEnviadoHeader:{
        backgroundColor:theme.palette.success.dark,
        color:'#000'
    },
    cardHeaderChequeIconDanger:{
        color:'#000'
    },
    cardHeaderChequeIconSuccess:{
        color:'#fff'
    },

    // CHEQUES
    cardChequeChip:{
        color:theme.palette.success.contrastText
    },
    alertCheque:{
        width:'100%'
    },
    CardHeaderGrupoCheques:{
        backgroundColor:theme.palette.primary.main,
        padding:theme.spacing(2)
    },
    CardMonthCheques:{
        width:'100%',
        backgroundColor:theme.palette.primary.main
    },

    //CARD CADENA DE PRODUCCION
    cardCadena:{
        width:'100%'
    },
    cardHeaderCadena:{
        backgroundColor:theme.palette.primary.main,
    },
    cardCadenaStep:{
        width:'300px'
    },
    cardHeaderCadenaStepActive:{
        backgroundColor:theme.palette.primary.main,
    },
    cardHeaderCadenaStepGreen:{
        backgroundColor:theme.palette.success.main,
    },

    // DEUDAS
    tabPanelDeuda:{
        width:'100% !important'
    },

    // NUEVO PRODUCTO
    cardHeaderStep:{
        backgroundColor:theme.palette.primary.main
    },

    //CARD CUENTA BANCARIA
    activeBankAccountCard:{
        backgroundColor:theme.palette.success.main
    },
    disabledBankAccountCard:{

    },
}))