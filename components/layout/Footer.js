import { Menu as MenuIcon } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';
import { theme } from '../../styles/theme';

const pages = ['About', 'Imprint'];

export default function FooterBar() {
  return (
    <footer
      position="absolute"
      style={{ backgroundColor: theme.palette.primary.main, }}
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
