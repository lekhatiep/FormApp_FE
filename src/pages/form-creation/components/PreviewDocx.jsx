import React, { useCallback, useEffect, useState } from "react";
import mammoth from "mammoth";
function PreviewDocx(props) {
  const { docxFile } = props ?? {};
  const [htmlContent, setHtmlContent] = useState("");

  const Display = useCallback(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const options = {
        convertImage: mammoth.images.inline((element) => {
          return element.read("base64").then((imageBuffer) => ({
            src: `data:${element.contentType};base64,${imageBuffer}`,
          }));
        }),
      };

      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer }, options)
        .then((result) => {
          const html = result.value;
          setHtmlContent(html);
        });
    };

    reader.readAsArrayBuffer(docxFile);
  }, [docxFile]);
  useEffect(() => {
    if (!docxFile) {
      return;
    }
    Display();
  }, [docxFile]);

  return (
    <React.Fragment>
      {htmlContent && (
        <div
          style={{
            marginTop: "10px",
            border: "1px solid gray",
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: "5px",
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </React.Fragment>
  );
}

export default PreviewDocx;
