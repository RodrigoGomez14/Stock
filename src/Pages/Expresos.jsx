import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import {CardExpreso} from '../components/Expresos/CardExpreso'

// COMPONENT
const Expresos=(props)=>{
    const classes = content()
    let [search,setSearch]=useState('')

    return(
        <Layout history={props.history} page="Expresos" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container spacing={4} >

                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
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
                    </Grid>
                    
                    {/* EXPRESOS LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                        {props.expresos?
                            Object.keys(props.expresos).map(key=>(
                                <CardExpreso datos={props.expresos[key].datos} search={search}/>
                            ))
                            :
                            <Typography variant='h5'>
                                Aun no hay ningun expreso ingresado
                            </Typography>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}
//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos
    }
}
export default connect(mapStateToProps,null)(Expresos)