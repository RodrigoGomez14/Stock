import React from 'react'
import {Grid,makeStyles} from '@material-ui/core'
import {LocalGasStationOutlined} from '@material-ui/icons'
import {Layout} from './Layout'

const useStyles = makeStyles(theme => ({
    root: {
      height:'100vh'
    },
    icon:{
        color:theme.palette.primary.contrastText
    }
  }))
export const PantallaDeCarga = () =>{
    const classes = useStyles()
    return (
        <Layout hiddenAppBar={true}>
            <Grid container className={classes.root} justify='center' alignItems='center'>
                <Grid container item xs={12} justify='center' spacing={3}>
                    <Grid item>
                        <LocalGasStationOutlined className={classes.icon}/>
                    </Grid>
                    <Grid item>
                        <LocalGasStationOutlined className={classes.icon}/>
                    </Grid>
                    <Grid item>
                        <LocalGasStationOutlined className={classes.icon}/>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    )
}