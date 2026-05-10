import React, { useState } from 'react'
import { Box } from '@mui/material'
import { NavBar } from '../components/Navbar'
import { MenuDrawer } from '../components/MenuDrawer'
import { DialogConfirmGoBack } from '../components/Dialogs/DialogConfirmGoBack'

export const Layout = ({ page, children, history, hiddenAppBar, blockGoBack, user }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const [dialogBlockOpen, setdialogBackOpen] = useState(false)
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <DialogConfirmGoBack blockGoBack={dialogBlockOpen} setBlockGoBack={setdialogBackOpen} history={history} />
      {!hiddenAppBar && (
        <NavBar
          page={page}
          history={history}
          setMenuOpened={setMenuOpened}
          menuOpened={menuOpened}
          blockGoBack={blockGoBack}
          setBlockGoBack={setdialogBackOpen}
          user={user}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          height: hiddenAppBar ? '100vh' : 'calc(100vh - 64px)',
          mt: hiddenAppBar ? 0 : '64px',
          mr: menuOpened ? '260px' : 0,
          transition: (t) => t.transitions.create('margin', {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.leavingScreen,
          }),
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
      {!hiddenAppBar && (
        <MenuDrawer menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      )}
    </Box>
  )
}
