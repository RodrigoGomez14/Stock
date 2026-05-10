import React, { useState } from 'react'
import { Box } from '@mui/material'
import { NavBar } from '../components/Navbar'
import { MenuDrawer } from '../components/MenuDrawer'
import { DialogConfirmGoBack } from '../components/Dialogs/DialogConfirmGoBack'

export const Layout = ({ page, children, history, hiddenAppBar, blockGoBack, user }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const [dialogBlockOpen, setdialogBackOpen] = useState(false)

  const sidebarWidth = menuOpened ? 200 : 64

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <DialogConfirmGoBack blockGoBack={dialogBlockOpen} setBlockGoBack={setdialogBackOpen} history={history} />
      {!hiddenAppBar && <MenuDrawer menuOpened={menuOpened} setMenuOpened={setMenuOpened} />}
      <Box
        sx={{
          flex: 1,
          ml: hiddenAppBar ? 0 : `${sidebarWidth}px`,
          transition: 'margin-left 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!hiddenAppBar && (
          <NavBar
            page={page}
            history={history}
            menuOpened={menuOpened}
            blockGoBack={blockGoBack}
            setBlockGoBack={setdialogBackOpen}
            user={user}
          />
        )}
        <Box
          sx={{
            flex: 1,
            mt: hiddenAppBar ? 0 : '56px',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
