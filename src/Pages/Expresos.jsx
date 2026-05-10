import React,{useState} from 'react'
import { withStore } from '../context/AppContext'
import {Layout} from './Layout'
import { makeStyles } from 'tss-react/mui'
import { Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent } from '@mui/material'
import {AttachMoney,PersonAdd} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import {CardExpreso} from '../components/Expresos/CardExpreso'
import Empty from '../images/Empty.png'
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
                            <>
                                <Grid item>
                                    <img src={Empty} alt="" height='500px'/>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h4'>No hay Expresos Ingresados</Typography>
                                </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}
export default withStore(Expresos)
