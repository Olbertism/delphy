import { ThemeContext } from '@emotion/react';
import { Menu as MenuIcon } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
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

const pages = ['Dashboard', 'Database'];
const settings = ['Profile', 'Logout'];
const authenticationControls = ['Register', 'Login'];

export default function ResponsiveAppBar(props) {
  console.log('appbar props', props);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElContribute, setAnchorElContribute] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenContributeMenu = (event) => {
    setAnchorElContribute(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseContributeMenu = () => {
    setAnchorElContribute(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={`/${page.charAt(0).toLowerCase() + page.slice(1)}`}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/*  ------------------ */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          {/*  Desktop Top Bar Menu Entries */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
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
            <MenuItem onClick={handleOpenContributeMenu}>
              Contribute
              <KeyboardArrowDownIcon />
            </MenuItem>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-contribute"
                anchorEl={anchorElContribute}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElContribute)}
                onClose={handleCloseContributeMenu}
              >
                <MenuItem
                  key="add-claim"
                  onClick={handleCloseContributeMenu}
                  component="a"
                  href="/database/contribute"
                >
                  <Typography textAlign="center">Add a claim</Typography>
                </MenuItem>
                <MenuItem
                  key="add-review"
                  onClick={handleCloseContributeMenu}
                  component="a"
                  href="/database/contribute"
                >
                  <Typography textAlign="center">Add a review</Typography>
                </MenuItem>

              </Menu>
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'flex' } }}>
            {props.user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{ bgcolor: theme.palette.secondary.main }}
                      alt={props.user ? props.user.username : ''}
                    >
                      {props.user ? props.user.username.slice(0, 1) : ''}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={handleCloseUserMenu}
                      component="a"
                      href={`/${
                        setting.charAt(0).toLowerCase() + setting.slice(1)
                      }`}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              authenticationControls.map((page) => (
                <MenuItem
                  key={page}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component="a"
                  href={`/${page.charAt(0).toLowerCase() + page.slice(1)}`}
                >
                  {page}
                </MenuItem>
              ))
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
