import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useCallback, useState } from "react";

const dropDownItems = ["a", "b", "c"];

export const DropDownMenu = (opts) => {
  const {
    ButtonMenu,
    // dropDownItems
  } = opts ?? {};

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const DropDownItems = useCallback(() => {
    return dropDownItems?.map((el, index) => {
      return (
        <MenuItem key={index} onClick={handleClose}>
          {el}
        </MenuItem>
      );
    });
  }, [dropDownItems]);

  return (
    <Box>
      <Button id="basic-button" onClick={handleClick} sx={{ color: "white" }}>
        <ButtonMenu />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <DropDownItems />
      </Menu>
    </Box>
  );
};
