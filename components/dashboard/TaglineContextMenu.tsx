import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function TaglineContextMenu(props) {

  console.log("COMPONENT")
  console.log(props.anchorEl)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(props.anchorEl);
  const open = Boolean(anchorEl);

  console.log('anchorEl', anchorEl)
  console.log('open', open)

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
  );
}
