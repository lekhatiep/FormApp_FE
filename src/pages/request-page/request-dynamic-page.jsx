import Notification from "@components/Snackbar/snackbar";
import { PERMISSIONS } from "@constants";
import { MainLayout } from "@components/layout";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { dayjs } from "@utils/date";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DATE_FORMAT,
  HOME_PAGE,
  NOTIFICATION,
  REQUEST_LIST,
  TIMESTAMP_FORMAT,
} from "@constants";
import { sendEmailtoStaffs } from "../../services/Mails/Mail";

import { makeStyles } from "@mui/styles";
import {URL_SERVER_LOCAL} from "../../constants/common";
const useStyles = makeStyles(() => ({
  requestPageContainer: {
    marginTop: "4.25rem",
    marginLeft: "12.5rem",
    backgroundColor: "#F5F5F5",
    height: "1000px",
    position: "relative",
  },
}));
export default function RequestDynamicForm() {

  let API_URL = "";
  if(URL_SERVER_LOCAL.indexOf("5001") > 1){
    API_URL = URL_SERVER_LOCAL + "/api/Ticket"
  }


  const navigate = useNavigate();
  const location = useLocation();
  const [sendmailSuccess, setSendmailSuccess] = useState(false);
  const [inputs, setInputs] = useState();
  const [formId, setformId] = useState(location?.state?.formId);
  const currentDate = dayjs();
  const [isPosted, setIsPosted] = useState(false);
  const [userID, setUserID] = useState();
  const [emailStaffs, setEmailStaffs] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getStaffEmailList = useCallback(async () => {
    const res = await axios.get(URL_SERVER_LOCAL +`/api/User/getStaffEmailList`, {
      params: { staffRole: PERMISSIONS.VERIFIER },
    });

    if (!res?.data) {
      return;
    }
    console.log(res?.data);
    
    setEmailStaffs(res?.data);
    const emails = emailStaffs?.map((mail) =>  
     {
      mail.email
      console.log(mail.email);
     }
      
  )
    .join(",");
            console.log(emails);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      const formattedDate = currentDate.format(TIMESTAMP_FORMAT);
      data["Ngày lập yêu cầu"] = formattedDate;
      const stringifyData = JSON.stringify(data);
      const formData = { formattedDate, formId, userID, stringifyData };
      try {
        axios
          .post(API_URL +`/postDynamicFormData`, formData)
          .then(async (res) => {
            if (!res?.data) {
              return;
            }

            setIsPosted(true);

            const emails = emailStaffs?.map((mail) => mail.email).join(",");
            console.log(emails);
            
            const emailParams = {
              //to_email: emails,
              to_email: 'popcap1012@gmail.com',
              from_name: "ĐHQG",
              to_name: "NHÂN VIÊN",
              message: "CÓ ĐƠN CẦN XÉT DUYỆT",
              subject: "CÓ ĐƠN MỚI",
              // reply_to: emails,
              //reply_to: ""
            };

            //const resultSendingMail = await sendEmailtoStaffs(emailParams);

            if (!resultSendingMail) {
              return;
            }

            setSendmailSuccess(true);
            navigate(REQUEST_LIST);
          });
      } catch (e) {
        console.error("[onSubmit] Get error submit: ", e);
      }
    },
    [emailStaffs, navigate]
  );
  const classes = useStyles();
  useEffect(() => {
    getStaffEmailList();
    setUserID(localStorage.getItem("Name") ?? "");
    setInputs(JSON.parse(location.state.data) ?? {});
  }, []);

  return (
    <MainLayout>
      <div className={classes.requestPageContainer} key={formId}>
        {sendmailSuccess && (
          <Notification message={NOTIFICATION.IS_SENT_MAIL} />
        )}
        <h1 style={{ paddingLeft: "30px" }}>Form: {location.state.name}</h1>
        {isPosted && <Notification message={NOTIFICATION.IS_SUBMITTED} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            padding="20px"
            width={"80%"}
            display="flex"
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            {inputs &&
              inputs?.map((item, index) => {
                const { id, type, label } = item ?? {};
                return (
                  <Box
                    key={id}
                    width={"45%"}
                    display={"flex"}
                    paddingY={"10px"}
                  >
                    <Box width={"40%"}>
                      <label htmlFor={`items[${index}].name`}>{label}</label>
                    </Box>
                    <Box>
                      {type === "textarea" ? (
                        <React.Fragment>
                          <textarea
                            rows="5"
                            cols="40"
                            name={`items[${index}].name`}
                            {...register(`${label}`, { required: true })}
                          />
                          {errors[`${label}`] && <p>This field is required</p>}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <input
                            style={{ marginLeft: "10px" }}
                            type={
                              type === "text"
                                ? "text"
                                : type === "date"
                                ? "date"
                                : "text"
                            }
                            //disabled={item.hasOwnProperty("date")}
                            name={`items[${index}].name`}
                            defaultValue={
                              id === "date"
                                ? dayjs(currentDate).format("MM-DD-YYYY")
                                : null
                            }
                            {...register(`${label}`, {
                              required: label !== "Ngày lập yêu cầu",
                            })}
                          />
                          {label !== "Ngày lập yêu cầu" &&
                            errors[`${label}`] && (
                              <p
                                style={{ marginLeft: "10px", color: "tomato" }}
                              >
                                This field is required
                              </p>
                            )}
                        </React.Fragment>
                      )}
                    </Box>
                  </Box>
                );
              })}
          </Box>
          <Box padding="20px">
            {inputs && (
              <React.Fragment>
                <Button variant="outlined" onClick={() => navigate(HOME_PAGE)}>
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  type="submit"
                  startIcon={<CheckIcon />}
                >
                  Submit
                </Button>
              </React.Fragment>
            )}
          </Box>
        </form>
      </div>
    </MainLayout>
  );
}
