import React from 'react'
import { Box, Typography } from '@mui/material'
import { content } from '../../Pages/styles/styles'

const TabPanel = (props) => {
    const classes = content()
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        className={classes.tabPanelDeuda}
        hidden={value !== index}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
}

export default TabPanel
