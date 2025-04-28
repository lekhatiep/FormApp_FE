import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import Notification from "../../../components/Snackbar/snackbar";
import CheckIcon from "@mui/icons-material/Check";
import { defaultStyle } from "@constants/form-style";
import { TextField } from "@mui/material";
import { NOTIFICATION, TIMESTAMP_FORMAT,  } from "@constants/common";
import { URL_SERVER_LOCAL } from "../../../constants/common";
export default function FormLinkEditingPopup(props) {

  console.log(props)
  const {
    handleCloseForm,
    formLinkName,
    formLinkDescription,
    formLinkUrl,
    form_link_id: formLinkId,
    handleRefresh,
  } = props ?? {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isModified, setIsModified] = useState(false);
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    handleCloseForm();
  };
  function handleUpdateForm(formLinkName, formLinkURL, formLinkDescription) {
    const formattedDate = dayjs().format(TIMESTAMP_FORMAT);

    const formData = {
      formLinkName,
      formLinkURL,
      formLinkDescription,
      formattedDate,
      formLinkId,
    };
    axios
      .put(URL_SERVER_LOCAL + "/api/form/updateFormLink", formData)
      .then((res) => {
        setIsModified(true);
        handleRefresh();
        setTimeout(() => {
          setIsModified(false);
          handleClose();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const onSubmit = (data) => {
    handleUpdateForm(
      data.formLinkName,
      data.formLinkUrl,
      data.formLinkDescription
    );
  };
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box flex sx={defaultStyle}>
          <Box width={"100%"}>
            {isModified && <Notification message={NOTIFICATION.IS_MODIFIED} />}
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box>
                <Box>
                  <label>Form name*:</label> <br />
                  <input
                    type="text"
                    defaultValue={formLinkName}
                    {...register(`formLinkName`, { required: true })}
                  />
                  {errors[`formLinkName`] && (
                    <span style={{ color: "tomato" }}>
                      This field is required
                    </span>
                  )}
                </Box>
                <React.Fragment>
                  <Box width={"12.5rem"}>
                    <label>Form Link*:</label> <br />
                    <input
                      style={{ width: "31.25rem" }}
                      maxLength={"100"}
                      type="text"
                      defaultValue={formLinkUrl}
                      {...register(`formLinkUrl`, { required: true })}
                    />
                    {errors[`formLinkUrl`] && (
                      <span style={{ color: "tomato" }}>
                        This field is required
                      </span>
                    )}
                  </Box>
                  <Box mt={2}>
                    <label>Form Description*:</label> <br />
                    <TextField
                      style={{
                        width: "100%",
                        border: "1px solid black",
                        borderRadius: "6px",
                      }}
                      placeholder="Form's Description"
                      multiline
                      rows={10}
                      defaultValue={formLinkDescription}
                      {...register(`formLinkDescription`, { required: true })}
                    />
                    {errors[`formLinkDescription`] && (
                      <span style={{ color: "tomato" }}>
                        This field is required
                      </span>
                    )}
                  </Box>
                  <Button
                    style={{ float: "right", margin: "20px 20px 0px 0px" }}
                    variant="contained"
                    type="submit"
                    startIcon={<CheckIcon />}
                  >
                    Submit
                  </Button>
                </React.Fragment>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
