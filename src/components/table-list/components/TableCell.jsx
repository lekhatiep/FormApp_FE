import React from "react";
import TableCell from "@mui/material/TableCell";
import { Button } from "@mui/material";
import UserContext from "@contexts/UserContext";
import { TICKET_STATUS } from "@constants";
import { useNavigate } from "react-router-dom";
function DataTableCell(props) {
  const navigate = useNavigate();
  const { row, column, value } = props ?? {};
  const { ticketId, status, username } = row ?? {};
  const { user } = React.useContext(UserContext) ?? {};
  return (
    <TableCell align={column.align} key={Math.random()}>
      {column.id === "action" ? (
        <Button
          variant="outlined"
          onClick={() => navigate(`/ticket-page/${ticketId}`)}
        >
          Proceed
        </Button>
      ) : column.id === TICKET_STATUS.UPDATE.toLowerCase() &&
        status?.toLowerCase() === TICKET_STATUS.UPDATE.toLowerCase() &&
        user?.accountId.toLowerCase() === username.toLowerCase() ? (
        <Button
          variant="outlined"
          onClick={() => navigate(`/update-ticket/${ticketId}`)}
        >
          Proceed
        </Button>
      ) : (
        value
      )}
    </TableCell>
  );
}

export default DataTableCell;
