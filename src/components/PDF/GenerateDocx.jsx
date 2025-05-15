import React, { useCallback, useEffect, useState } from "react";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";
import { Button } from "@mui/material";
import Notification from "../Snackbar/snackbar";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
import { NOTIFICATION } from "@constants/common";
const GenDocx = (props) => {
  
  const { formData, dynamicFormData } = props ?? {};
  console.log("formData (dynamic + from database)", formData);
  
  
  //dummy code 
  //formData.fullName = formData['H? tên'];
  //formData.birthdate = formData['Ngày sinh'];

  
  //
  //console.log("formData update", formData);
  //console.log("dynamicFormData", dynamicFormData);
  const { formFile: formFile } = dynamicFormData ?? {};

  const [isSelectedFile, setIsSelectedFile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  // Decode the base64 string
  const CreateFile = useCallback(() => {
    const binaryData = atob(formFile);

    // Create an ArrayBuffer from the binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const docxfile = new File([blob], "file.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    setFile(docxfile);
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    CreateFile();
  }, []);


  const generate = useCallback(
    (e) => {
      e.preventDefault();
      if (!file) {
        setIsSelectedFile(false);
        setTimeout(() => {
          setIsSelectedFile(true);
        }, 2000);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        //const data = formData;
        formData.currentYear = new Date().getFullYear();
        //console.log("formData", formData);
        const data = normalizeKeys(formData);
        //console.log("data", data);
        doc.setData(data);
        doc.render();

        const generatedBlob = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "DEFLATE",
        });
        const generatedURL = URL.createObjectURL(generatedBlob);
        setOutput(generatedURL);

        saveAs(generatedBlob, "generated.docx");
      };

      reader.readAsBinaryString(file);
    },
    [file]
  );
  return (
    <React.Fragment>
      <div className="p-2">
        {!isSelectedFile && (
          <Notification message={NOTIFICATION.IS_NOT_SELECTED_FILE} />
        )}
        {isLoaded && (
          <Button variant="contained" onClick={generate}>
            <ArticleIcon />
            <DownloadIcon />
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};

function normalizeKeys(data) {
  const result = {};
  for (const key in data) {
    const newKey = key
      .normalize("NFD") // chuẩn hóa Unicode để tách dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu tiếng Việt
      .replace(/\s+/g, "") // xóa khoảng trắng
      .replace(/[^a-zA-Z0-9_]/g, "") // xóa ký tự đặc biệt
      .toLowerCase();
    result[newKey] = data[key];
  }
  return result;
}

export default GenDocx;
