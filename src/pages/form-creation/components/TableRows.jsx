import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import dayjs from "dayjs";

import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormLinkEditingPopup from "./FormLinkEditingPopup";
import { DATE_FORMAT } from "@constants/common";
export default function Rows({
  row,
  columns,
  isEditing,
  handleCloseForm,
  handleModifyFormById,
  handleDeleteFormById,
  handleRefresh,
}) {
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
      {columns.map((column, key) => {
        const value =
          column.id === "date_created"
            ? dayjs(row[column.id]).format(DATE_FORMAT)
            : row[column.id];
        const { form_link_id: formLinkId } = row ?? {};
        return (
          <TableCell key={column.id} align={column.align}>
            {isEditing === formLinkId && (
              <FormLinkEditingPopup
                handleRefresh={handleRefresh}
                handleCloseForm={handleCloseForm}
                {...row}
              />
            )}
            {column.id === "action" ? (
              <React.Fragment>
                <IconButton
                  color="primary"
                  onClick={() => handleModifyFormById(formLinkId)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleDeleteFormById(formLinkId)}
                  style={{
                    color: "tomato",
                    borderColor: "red",
                    marginLeft: "10px",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </React.Fragment>
            ) : (
              value
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
