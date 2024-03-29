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
import * as React from 'react';
import { theme } from '../../styles/theme';

const pages = ['Dashboard', 'Database'];
const authenticationControls = ['Register', 'Login'];

export default function ResponsiveAppBar(props) {
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
    <AppBar
      position="static"
      sx={
        props.landingPage ? { position: 'fixed', zIndex: '99' } : { mb: '30px' }
      }
    >
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
            ᐃelphi
          </Typography>

          {props.user ? (
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
                  href="/database/contribute-review"
                >
                  <Typography textAlign="center">Add a review</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
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
            ᐃelphi
          </Typography>
          {/*  Desktop Top Bar Menu Entries */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {props.user ? (
              <>
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
                <MenuItem
                  onClick={handleOpenContributeMenu}
                  component="a"
                  sx={{ mb: 0 }}
                >
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
                    href="/database/contribute-review"
                  >
                    <Typography textAlign="center">Add a review</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : null}
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
                  <MenuItem
                    key="profile"
                    onClick={handleCloseUserMenu}
                    component="a"
                    href={`/users/${props.user.username}`}
                  >
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    key="logout"
                    onClick={handleCloseUserMenu}
                    component="a"
                    href="/logout"
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>

                  {/* {settings.map((setting) => (
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
                  ))} */}
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
