import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { theme } from '../../styles/theme';

const pages = ['About', 'Imprint'];

export default function FooterBar(props) {
  return (
    <footer
      // position={ props.landingPage ? "fixed" : "absolute" }
      style={{
        backgroundColor: theme.palette.primary.main ,
        position: props.landingPage ? 'fixed' : 'absolute',
        left: props.landingPage ? 0 : 'none',
        bottom: props.landingPage ? 0 : 'none',
        width: '100%',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            {pages.map((page) => (
              <MenuItem
                key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
                component="a"
                href={`/${page.charAt(0).toLowerCase() + page.slice(1)}`}
              >
                {page}
              </MenuItem>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </footer>
  );
}
