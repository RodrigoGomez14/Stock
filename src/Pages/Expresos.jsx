import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'


const useStyles=makeStyles(theme=>({
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    cardContent:{
        padding:0,
    },
    card:{
        height:'150px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',

    },
    link:{
        outline:'none',
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    container:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1)
    },
    containerClientes:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    }
}))
const Expresos=(props)=>{
    const classes = useStyles()
    let [search,setSearch]=useState('')


    const renderExpresos = () =>
        Object.keys(props.expresos).map(key=>(
            <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:key.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                <Link 
                    className={classes.link}
                    to={{
                    pathname:'/Expreso',
                    search:`${key}`
                }}>
                        <Card className={classes.card}>
                            <CardContent className={classes.cardContent}>
                                <Typography variant="h5" component="h2">
                                    {key}
                                </Typography>
                            </CardContent>
                        </Card>
                </Link>
            </Grid>
        ))

    return(
        <Layout history={props.history} page="Expresos" user={props.user.uid}>
            <Grid container justify='center' alignItems='center' className={classes.container} >
                <Grid item>
                    <Link 
                        to='/Nuevo-Expreso'>
                        <IconButton>
                            <PersonAdd/>
                        </IconButton>
                    </Link>
                </Grid>
                <Grid item>
                    <TextField
                        value={search}
                        onChange={e=>{
                            setSearch(e.target.value)
                        }}
                        disabled={!props.expresos}
                        label='Buscar Expreso'
                    />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.container} >
                    {props.expresos?
                        <Grid item xs={12} sm={10} md={9} lg={8}>
                            <Grid container justify='space-around'  alignItems='center' spacing={1}>
                                {renderExpresos()}
                            </Grid>
                        </Grid>
                        :
                        <Typography variant='h5'>
                            Aun no hay ningun expreso ingresado
                        </Typography>
                    }
                </Grid>
            </Grid>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos
    }
}
export default connect(mapStateToProps,null)(Expresos)