import Snackbar from "@mui/material/Snackbar";
import { useCallback, useState } from "react";

export default function Notification(props) {
  const { message } = props;
  const [open, setOpen] = useState(true);
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={message}
      key={vertical + horizontal}
      style={{ zIndex: 9999 }} // Adjust the z-index value as needed
    />
  );
}
