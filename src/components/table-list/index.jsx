import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ROW_PER_PAGE } from "@constants";
import DataTableCell from "./components/TableCell";

function TableList({ columns, rows, name }) {
  const [page, setPage] = React.useState(0);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = React.useCallback((event, newPage) => {
    setPage(newPage);
  }, []);
  const handleChangeRowsPerPage = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  }, []);
  return (
    <Paper>
      <div>
        <h1 style={{ padding: "20px 0px 0 20px" }}>{name}</h1>
        <TableContainer
          sx={{
            width: "88.8%",
            right: 0,
            marginLeft: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.ticketId}
                    >
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <DataTableCell
                            key={index}
                            row={row}
                            column={column}
                            value={value}
                          />
                        );
                      })}
                    </TableRow>
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
      </div>
    </Paper>
  );
}

export default TableList;
