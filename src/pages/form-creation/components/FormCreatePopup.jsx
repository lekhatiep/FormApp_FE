import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import FormInput from "./FormInput";
import dayjs from "dayjs";
import axios from "axios";
import Notification from "../../../components/Snackbar/snackbar";
import PreviewDocx from "./PreviewDocx";
import { defaultStyle, previewStyle } from "@constants/form-style";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { NOTIFICATION, TIMESTAMP_FORMAT, URL_SERVER_LOCAL } from "@constants/common";

export default function BasicModal(props) {
  const { handleCloseForm, handleRefresh } = props;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const [isSuccessed, setIsSuccessed] = useState(false);
  const [open, setOpen] = useState(true);
  const [formName, setFormName] = useState("");
  const [formFile, setFormFile] = useState(null);
  const [formType, setFormType] = useState("dynamic");
  const [isDynamicType, setIsDynamicType] = useState(true);
  const [formTitle, setFormTitle] = useState("");
  const [labels, setLabels] = useState([]);
  const handleAddInput = useCallback((type) => {
    setLabels((prevItems) => [...prevItems, "Init Label"]);
    append({ name: "", type: type });
  }, []);
  useEffect(() => {
    if (formFile) {
      setFormTitle(formFile.name);
    }
  }, [formFile]);
  useEffect(() => {
    if (formType === "dynamic") {
      setIsDynamicType(true);
    } else setIsDynamicType(false);
  }, [formType]);

  const handleFormFileInputChange = useCallback((event) => {
    const file = event.target.files[0];
    setFormFile(file);
  }, []);
  useEffect(() => {
    if (!isSuccessed) {
      return;
    }
    setTimeout(() => {
      handleClose();
    }, 2000);
  }, [isSuccessed]);
  const handleClose = useCallback(() => {
    handleRefresh();
    setOpen(false);
    handleCloseForm();
  }, []);
  const handleChangeLabel = (label, index) => {
    const newLabels = [...labels];
    newLabels[index] = label;
    setLabels(newLabels);
  };
  const handleRemoveLabel = (indexToRemove) => {
    setLabels((prevLabels) =>
      prevLabels.filter((_, index) => index !== indexToRemove)
    );
  };
  function handlePostNewForm(formName, formFile, formData) {
    const formattedDate = dayjs().format(TIMESTAMP_FORMAT);
    const dynamicFormData = {
      form_name: formName,
      form_file: formFile,
      form_data: formData,
      form_title: formTitle,
    };
    axios
      .post(URL_SERVER_LOCAL + "/api/Form/createNewDynamicForm", dynamicFormData)
      .then(() => {
        setIsSuccessed(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handlePostNewFormLink(
    formLinkName,
    formLinkUrl,
    formLinkDescription
  ) {
    const formattedDate = dayjs().format(TIMESTAMP_FORMAT);
    const formData = {
      formLinkName,
      formLinkUrl,
      formLinkDescription,
      // formattedDate,
    };
    axios
      .post(URL_SERVER_LOCAL + "/api/Form/createNewFormLink", formData)
      .then(() => {
        setIsSuccessed(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const onSubmit = (data) => {
    if (formName && formFile && isDynamicType) {
      const formData = [
        { label: "Ngày lập yêu cầu", id: "date", date: "" },
        {
          label: "Số điện thoại",
          id: "phonenumber",
          value: "",
        },
      ];
      labels.map((label, index) => {
        let input = {
          label,
          ...fields[index],
        };
        formData.push(input);
      });
      // Convert file to base64
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64 = fileReader.result.split(",")[1];
        handlePostNewForm(formName, base64, JSON.stringify(formData));
      };
      fileReader.readAsDataURL(formFile);
    } else if (!isDynamicType && formName) {
      handlePostNewFormLink(formName, data.formLink, data.formLinkDescription);
    }
  };
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          flex
          sx={formFile ? previewStyle : defaultStyle}
          style={{ overflow: "auto" }}
        >
          <Box width={formFile ? "80%" : "100%"}>
            {isSuccessed && (
              <Notification message={NOTIFICATION.IS_SUBMITTED} />
            )}
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box
                display={"Flex"}
                justifyContent={"space-between"}
                borderBottom={"1px solid black"}
                paddingBottom={"10px"}
              >
                <Box>
                  <label>Form name*:</label> <br />
                  <input
                    type="text"
                    onChange={(event) => {
                      setFormName(event.target.value);
                    }}
                  />
                </Box>
                <Box width={"25rem"}>
                  <FormControl style={{ width: "12.5rem" }}>
                    <InputLabel
                      id="status-label"
                      style={{
                        padding: "0px 10px",
                        zIndex: "20",
                        display: "block",
                        background: "white",
                        borderRadius: "4px",
                      }}
                    >
                      Type of Form
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      defaultValue="dynamic"
                      onChange={(value) => {
                        setFormType(value.target.value);
                      }}
                    >
                      <MenuItem value="dynamic">Dynamic Form</MenuItem>
                      <MenuItem value="link">Links Form</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {isDynamicType && (
                  <Box>
                    <label>File Upload*:</label> <br />
                    <input
                      type="file"
                      accept=".docx"
                      onChange={handleFormFileInputChange}
                    />
                  </Box>
                )}
              </Box>
              <Box marginTop={"20px"}>
                {isDynamicType && (
                  <Box display={"flex"} flexWrap={"wrap"}>
                    <Box width={"100%"}>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={() => {
                          handleAddInput("text");
                        }}
                        startIcon={<AddIcon />}
                      >
                        Text Input
                      </Button>
                      <Button
                        style={{ marginLeft: "20px" }}
                        variant="contained"
                        type="button"
                        onClick={() => {
                          handleAddInput("date");
                        }}
                        startIcon={<AddIcon />}
                      >
                        Date Input
                      </Button>
                      <Button
                        style={{ marginLeft: "20px" }}
                        variant="contained"
                        type="button"
                        onClick={() => {
                          handleAddInput("textarea");
                        }}
                        startIcon={<AddIcon />}
                      >
                        Text Area
                      </Button>
                      <Button
                        style={{ marginLeft: "20px" }}
                        variant="contained"
                        type="submit"
                        startIcon={<CheckIcon />}
                      >
                        Submit
                      </Button>
                    </Box>
                    <Box marginTop={1}>
                      <label>Các trường mặc định:</label>
                      <br />
                      <textarea
                        disabled
                        rows={8}
                        cols={20}
                        placeholder="username&#13;firstname&#13;lastname&#13;email&#13;currentyear&#13;maxStudyTime&#13;birthdate"
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              {isDynamicType ? (
                <Box>
                  <Box
                    marginTop={"20px"}
                    border="0.5px solid grey"
                    borderRadius={"8px"}
                    padding={"12px"}
                  >
                    <Box
                      display={"Flex"}
                      justifyContent={"space-between"}
                      borderBottom={"1px solid black"}
                      paddingBottom={"10px"}
                    >
                      <Box>
                        <label>Ngày lập yêu cầu*:</label> <br />
                        <input type="date" disabled />
                      </Box>
                      <Box width={"35%"}>
                        <label>Số điện thoại*:</label> <br />
                        <input type="text" disabled />
                      </Box>
                    </Box>
                    {fields.map((item, index) => {
                      return (
                        <div key={item.id}>
                          <FormInput
                            key={item.id}
                            item={item}
                            index={index}
                            label={labels[index]}
                            handleChangeLabel={handleChangeLabel}
                            remove={remove}
                            handleRemoveLabel={handleRemoveLabel}
                          />
                        </div>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <React.Fragment>
                  <Box width={"12.5rem"}>
                    <label>Form Link*:</label> <br />
                    <input
                      style={{ width: "500px" }}
                      maxLength={"100"}
                      type="text"
                      {...register(`formLink`, { required: true })}
                    />
                    {errors[`formLink`] && (
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
              )}
            </form>
          </Box>
          {formFile && <Box width={"1.875rem"} />}
          {formFile && (
            <Box>
              <PreviewDocx docxFile={formFile} />
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
