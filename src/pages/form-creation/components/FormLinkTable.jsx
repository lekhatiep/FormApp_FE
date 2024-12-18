import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Notification from "../../../components/Snackbar/snackbar";
import Rows from "./TableRows";
import { NOTIFICATION, ROW_PER_PAGE } from "@constants/common";
import { URL_SERVER_LOCAL } from "../../../constants/common";

function FormLinkManagement(props) {
  const { columns, rows, setLinkRows, handleRefresh } = props ?? {};
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isEditing, setIsEditing] = React.useState(0);
  const titleCols = React.useMemo(() => {
    return columns.map((column) => (
      <TableCell
        key={column.id}
        align={column.align}
        style={{ minWidth: column.minWidth }}
      >
        {column.label}
      </TableCell>
    ));
  }, []);
  function handleCloseForm() {
    setIsEditing(-1);
  }
  const handleChangePage = React.useCallback((event, newPage) => {
    setPage(newPage);
  }, []);
  const handleChangeRowsPerPage = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  }, []);
  const handleModifyFormById = React.useCallback((id) => {
    setIsEditing(id);
  }, []);
  const handleDeleteFormById = React.useCallback(
    (id) => {
      const formId = id;
      axios
        .delete(URL_SERVER_LOCAL +`/api/form/deleteFormLinkById/${formId}`, )
        .then(() => {
          setIsDeleted(true);
          setLinkRows(
            rows.filter((item) => item.form_link_id !== formId) ?? []
          );

          setTimeout(() => {
            setIsDeleted(false);
          }, 1500);
        })
        .catch((error) => console.log(error));
    },
    [rows]
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ minHeight: 550, maxHeight: 550, marginTop: 2 }}>
        {isDeleted && <Notification message={NOTIFICATION.IS_DELETED} />}
        <Table stickyHeader>
          <TableHead>
            <TableRow>{titleCols}</TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const { form_link_id: formLinkId } = row ?? {};
                return (
                  <Rows
                    handleRefresh={handleRefresh}
                    key={formLinkId}
                    row={row}
                    columns={columns}
                    isEditing={isEditing}
                    handleCloseForm={handleCloseForm}
                    handleModifyFormById={handleModifyFormById}
                    handleDeleteFormById={handleDeleteFormById}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROW_PER_PAGE}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default FormLinkManagement;
