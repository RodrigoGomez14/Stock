import React from 'react'
import {Link} from 'react-router-dom'
import { Layout } from './Layout'
import {content} from './styles/styles'
import {Paper} from '@material-ui/core'

export const NotFound = (props) =>{
    const classes = content()
    return(
        <Layout history={props.history} page='Not Found' >
            <Paper className={classes.content}>
                <h1>la pagina no se encuentra disponible</h1>
                <Link to='/'>
                    Vuelve al Home
                </Link>
            </Paper>
        </Layout>
    )
}