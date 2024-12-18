import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
function FormInput(props) {
  const { item, index, label, handleChangeLabel, remove, handleRemoveLabel } =
    props ?? {};
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label ?? {});
  const toggleEditing = () => {
    setEditing(!editing);
  };
  return (
    <div>
      <br />

      {!editing && (
        <React.Fragment>
          <label htmlFor={`items[${index}].name`}>{label}</label>
          {item.type === "textarea" ? (
            <textarea style={{ marginLeft: "20px" }} rows="4" cols="20" />
          ) : (
            <input
              style={{ marginLeft: "10px" }}
              type={item.type}
              name={`items[${index}].name`}
              defaultValue={item.name}
            />
          )}
          <IconButton
            color="primary"
            onClick={() => {
              toggleEditing();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleRemoveLabel(index);
              remove(index);
            }}
            color="secondary"
          >
            <DeleteOutlineIcon />
          </IconButton>{" "}
        </React.Fragment>
      )}
      {editing && (
        <Box>
          <label>{label}</label>
          <input
            style={{ marginLeft: "10px" }}
            type="text"
            defaultValue={"Insert new name..."}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button
            variant="contained"
            style={{
              height: "30px",
              color: "white",
              marginLeft: "10px",
            }}
            onClick={() => {
              handleChangeLabel(value, index);
              toggleEditing();
            }}
          >
            Confirm
          </Button>
        </Box>
      )}
    </div>
  );
}

export default FormInput;
