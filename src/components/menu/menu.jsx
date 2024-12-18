import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ zIndex: "10" }}>
      <Button id="basic-button" onClick={handleClick}>
        Notification
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Notification 1</MenuItem>
        <MenuItem onClick={handleClose}>Notification 2</MenuItem>
        <MenuItem onClick={handleClose}>Notification 3</MenuItem>
      </Menu>
    </div>
  );
}
