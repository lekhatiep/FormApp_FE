import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import FormInput from "./FormInput";
import dayjs from "dayjs";
import axios from "axios";
import Notification from "../../../components/Snackbar/snackbar";
import { defaultStyle, previewStyle } from "@constants/form-style";
import PreviewDocx from "./PreviewDocx";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { NOTIFICATION, TIMESTAMP_FORMAT } from "@constants/common";

import { APPROVAL_LIST, PERMISSIONS ,URL_SERVER_LOCAL} from "../../../constants/common";

export default function FormEditing(props) {
  const {
    handleCloseForm,
    ExistingFormData,
    form_name: formPrevName,
    form_file: formPrevFile,
    form_title: formPrevTitle,
    form_id: formId,
    handleRefresh,
  } = props ?? {};

  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items", // Name of the array field
  });
  const [isModified, setIsModified] = useState(false);
  const [open, setOpen] = useState(true);
  const [formName, setFormName] = useState(formPrevName ?? "");
  const [formFile, setFormFile] = useState();
  const [labels, setLabels] = useState([]);
  const [formTitle, setFormTitle] = useState(formPrevTitle ?? "");
  const handleAddInput = useCallback((type) => {
    setLabels((prevItems) => [...prevItems, "Init Label"]);
    append({ name: "", type: type });
  }, []);
  const handleClose = () => {
    setOpen(false);
    handleCloseForm();
  };
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
  function isBase64String(str) {
    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
  }
  const handleFillForm = useCallback((item) => {
    const { id, type } = item;
    append({ id, type });
    setLabels((prevItems) => [...prevItems, item.label]);
  }, []);
  function handleUpdateForm(formUpdateName, formUpdateFile, formUpdateData) {
    const formattedDate = dayjs().format(TIMESTAMP_FORMAT);

    const formData = {
      formUpdateName,
      formUpdateFile,
      formUpdateData,
      formTitle,
      formId,
    };
    axios
      .put(URL_SERVER_LOCAL + "/api/form/updateDynamicForm", formData)
      .then((res) => {
        setIsModified(true);
        handleRefresh();
        setTimeout(() => {
          handleClose();
          setIsModified(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const onSubmit = () => {
    if (formName && formFile) {
      const DATE_REQUEST = "Ngày lập yêu cầu";
      const PHONE_NUMBER = "Số điện thoại";
      const formData = [];

      labels.map((label, index) => {
        switch (label) {
          case DATE_REQUEST: {
            const input = {
              label,
              id: "date",
              date: "",
            };
            formData.push(input);
            break;
          }
          case PHONE_NUMBER: {
            const input = {
              label,
              id: "phonenumber",
            };
            formData.push(input);
            break;
          }
          default: {
            const input = {
              label,
              ...fields[index],
            };
            formData.push(input);
            break;
          }
        }
      });
      //File not changed
      if (isBase64String(formFile)) {
        handleUpdateForm(formName, formFile, JSON.stringify(formData));
      } else {
        // Convert file to base64
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const base64 = fileReader.result.split(",")[1];
          handleUpdateForm(formName, base64, JSON.stringify(formData));
        };
        fileReader.readAsDataURL(formFile);
      }
    }
  };
  const handleFormFileInputChange = useCallback((event) => {
    const file = event.target.files[0];
    setFormFile(file);
    setFormTitle(file.name);
  }, []);
  const CreateFile = useCallback(() => {
    const binaryData = atob(formPrevFile);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const docxfile = new File([blob], "file.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    setFormFile(docxfile);
  }, []);
  useEffect(() => {
    ExistingFormData.map((item) => {
      handleFillForm(item);
    });
    if (!formPrevFile) {
      return;
    }
    CreateFile();
  }, []);
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          flex
          sx={formFile ? previewStyle : defaultStyle}
          style={{ overflow: "auto" }}
        >
          <Box width={formFile ? "80%" : "100%"}>
            {isModified && <Notification message={NOTIFICATION.IS_MODIFIED} />}
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
                    defaultValue={formName}
                    onChange={(event) => {
                      setFormName(event.target.value);
                    }}
                  />
                </Box>
                <Box width={"35%"}>
                  <label>File Upload*: {formTitle}</label> <br />
                  <input
                    type="file"
                    id="files"
                    accept=".docx"
                    onChange={handleFormFileInputChange}
                  />
                </Box>
              </Box>
              <Box marginTop={"20px"} display={"flex"} flexWrap={"wrap"}>
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
                    placeholder="academicYear&#13;faculty&#13;phoneNumber&#13;placeOfBirth&#13;trainingForm&#13;maxStudyTime&#13;birthdate"
                  />
                </Box>
              </Box>
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
                        {labels[index] !== "Số điện thoại" &&
                          labels[index] !== "Ngày lập yêu cầu" && (
                            <FormInput
                              key={item.id}
                              item={item}
                              index={index}
                              label={labels[index]}
                              handleChangeLabel={handleChangeLabel}
                              remove={remove}
                              handleRemoveLabel={handleRemoveLabel}
                            />
                          )}
                      </div>
                    );
                  })}
                </Box>
              </Box>
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
