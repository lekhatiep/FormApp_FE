import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import dayjs from "dayjs";
import FormEditing from "@pages/form-creation/components/FormEditingPopup";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
      {columns.map((column) => {
        const value =
          column.id === "date_created"
            ? dayjs(row[column.id]).format(DATE_FORMAT)
            : row[column.id];

        const { form_id: formId, form_data: formData } = row ?? {};
        return (
          <TableCell key={column.id} align={column.align}>
            {isEditing === formId && (
              <FormEditing
                handleCloseForm={handleCloseForm}
                {...row}
                handleRefresh={handleRefresh}
                ExistingFormData={JSON.parse(formData)}
              />
            )}
            {column.id === "action" ? (
              <React.Fragment>
                <IconButton
                  color="primary"
                  onClick={() => handleModifyFormById(formId)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleDeleteFormById(formId)}
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
