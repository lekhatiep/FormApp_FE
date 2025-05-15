import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { MainLayout } from "../../components/layout";
import UserContext from "@contexts/UserContext";
import GenDocx from "../../components/PDF/GenerateDocx";
import dayjs from "dayjs";
import {
  sendEmailtoStaffs,
  sendEmailtoStudents,
} from "../../services/Mails/Mail";
import Notification from "../../components/Snackbar/snackbar";
import { DATE_FORMAT, NOTIFICATION, TIMESTAMP_FORMAT } from "@constants";
import { makeStyles } from "@mui/styles";
import { BIRTHDATE_FORMAT, MAX_TIME_FORMAT, URL_SERVER_LOCAL } from "../../constants/common";

const useStyles = makeStyles(() => ({
  ticketProcess: {
    width: "25%",
    height: "auto",
    border: "1px solid rgb(126, 125, 125)",
    padding: "6.25rem",
    backgroundColor: "rgb(255, 255, 255)",
    margin: "0.625rem",
  },
  ticketFormBox: {
    width: "68.75rem",
    minHeight: "14.375rem",
    margin: "0.625rem 0 0.625rem 3.5rem",
    borderRadius: "0.3125rem",
    backgroundColor: "white",
    boxShadow: "0.625rem 0.3125rem 0.3125rem rgb(212, 211, 211)",
    padding: "2.5rem",
  },
  ticketInputBox: {
    width: "68.75rem",
    minHeight: "14.375rem",
    margin: "0.625rem 0 0.625rem 3.5rem",
    borderRadius: "0.3125rem",
    backgroundColor: "white",
    boxShadow: "0.625rem 0.3125rem 0.3125rem rgb(212, 211, 211)",
    padding: "2.5rem",
  },
  ticketOutputBox: {
    width: "68.75rem",
    minHeight: "14.375rem",
    margin: "0.625rem 0 0.625rem 3.5rem",
    borderRadius: "0.3125rem",
    backgroundColor: "white",
    boxShadow: "0.625rem 0.3125rem 0.3125rem rgb(212, 211, 211)",
    padding: "2.5rem",
  },
  ticketContainer: {
    display: "flex",
    marginTop: "4.25rem",
    marginLeft: "16.25rem",
    backgroundColor: "#F5F5F5",
  },
}));

const steps = [
  {
    label: "Student submit form",
  },
  {
    label: "Verify information",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Approve the form",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Download and sign",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {},
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#FFD700",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#7CFC00",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    borderWidth: 5,
    marginLeft: -3,
  },
}));

export default function TicketPage() {
  const { user } = useContext(UserContext) ?? "";
  const params = useParams();
  const [sendmailSuccess, setSendmailSuccess] = useState(false);
  const [requestor, setRequestor] = useState("");
  const [ticketID, setTicketID] = useState(params.id ?? "");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isNext, setIsNext] = React.useState(false);
  const [isDisApproved, setIsDisApproved] = React.useState(false);
  const [userDenied, setUserDenied] = React.useState(true);
  const [ticketData, setTicketData] = React.useState();
  const [previousNote, setPreviousNote] = React.useState(null);
  const [note, setNote] = React.useState("");
  const [noteRequired, setNoteRequired] = useState(false);
  const [formData, setFormData] = useState(null);
  const [dynamicFormData, setDynamicFormData] = useState(null);
  const [isCommitted, setIsCommitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const classes = useStyles();
  const token = localStorage.getItem("Token");
  
  console.log(user.role);
  console.log(activeStep);
  
  useEffect(() => {
    if (!isNext) {
      return;
    }
    handleUpdateStep();
    return () => {};
  }, [isNext]);
  const checkPermission = () => {
    switch (activeStep) {
      case 1: {
        return "verifier";
      }
      case 2: {
        return "approver";
      }
      case 3: {
        return "executor";
      }
    }
  };
  useEffect(() => {
    {
      if (user.role === "executor" && activeStep === 4) {
        handleUpdateStatus();
        return;
      }
      if (user.role !== "admin" && user.role === checkPermission(activeStep)) {
        setUserDenied(false);
        return;
      }
    }
  }, [activeStep]);
  const fechDynamicFormById = useCallback(async () => {
    const rs = await axios.get(
      URL_SERVER_LOCAL+`/api/Form/getDynamicFormByID/${ticketID}`
    );
    return rs;
  }, [ticketID]);


  const fetchDataByTicketId = useCallback(async () => {

    try {

      const rs = await axios.get(
        URL_SERVER_LOCAL+`/api/Ticket/getDataByTicketID/${ticketID}`
      );

      console.log(rs.data.ticket_data);
      
      setTicketData(JSON.parse(rs.data.ticket_data));
      setRequestor(rs.data.username);
      setPreviousNote(rs.data.note);
      setActiveStep(rs.data.active_step);
      if (rs.data.status == "Update") {
        setIsDisApproved(true);
      }
      return rs;

    }catch (err) {
      console.log("[fetchTicketData] | Get Error: ", err);
    }
  
  }, [ticketID]);
  useEffect(() => {
    Promise.allSettled([fetchDataByTicketId(), fechDynamicFormById()]).then(
      (res) => {
        console.log(res);
        
        const formData = JSON.parse(res[0]?.value?.data.ticket_data);
        formData.firstName = res[0]?.value?.data.firstName;
        formData.lastName = res[0]?.value?.data.lastName;
        formData.email = res[0]?.value?.data.email;
        formData.studentId = res[0]?.value?.data.student_id;
        formData.academicYear = res[0]?.value?.data.academic_year;
        formData.faculty = res[0]?.value?.data.faculty;
        formData.phoneNumber = res[0]?.value?.data.phone_number;
        formData.placeOfBirth = res[0]?.value?.data.place_of_birth;
        formData.trainingForm = res[0]?.value?.data.training_form;
        const parsedBirthdate = dayjs(res[0]?.value?.data.birthdate);
        formData.birthdate = parsedBirthdate.format(BIRTHDATE_FORMAT);
        const parsedMaxStudyTime = dayjs(res[0]?.value?.data.max_study_time);
        formData.username = res[0]?.value?.data.username;
        
        console.log(formData);
        const Data = {
          approved_date: dayjs().date(),
          approved_month: dayjs().month() + 1,
          approved_year: dayjs().year(),
        };
        const merged = { ...formData, ...Data };
        setFormData(merged);
        setDynamicFormData(res[1]?.value?.data);
      }
    );
  }, [ticketID]);
  const handleNext = (e) => {
    e.preventDefault();
    if (note !== "") {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsNext(user.role !== "admin");
      handleUpdateNote();
    }
  };

  async function handleUpdateStatus() {
    const currentDate = dayjs().format(TIMESTAMP_FORMAT);
    await axios.post(URL_SERVER_LOCAL+`/api/Ticket/updateStatus`, {
      ticketID,
      currentDate,
    });
  }
  async function HandlegetStudentEmail() {
    const res = await axios.get(URL_SERVER_LOCAL+`/api/User/getStudentEmail`, {
      params: { requestor },
    });
    return res.data.email;
  }
  async function HandleGetNextStaffEmailList() {
    let staffRole = "";
    switch (activeStep) {
      case 2:
        staffRole = "approver";
        break;
      case 3:
        staffRole = "executor";
        break;
    }
    const res = await axios.get(URL_SERVER_LOCAL+`/api/User/getStaffEmailList`, {
      params: { staffRole },
      headers: {
        Authorization: `Bearer ${token}`,
       },
    });
    return res.data;
  }

  function handleUpdateStep() {
    axios
      .post(URL_SERVER_LOCAL+`/api/Ticket/updateStepTicket`, { ticketID })
      .then(async () => {
        const studentEmail = await HandlegetStudentEmail();
        const nextStaffEmailList = await HandleGetNextStaffEmailList();
        const StaffEmails = nextStaffEmailList
          .map((staffEmail) => staffEmail.email)
          .join(",");

        const studentMessage =
          activeStep === 4
            ? `ĐƠN CỦA BẠN ĐÃ XÉT DUYỆT XONG`
            : `ĐƠN CỦA BẠN ĐÃ XÉT DUYỆT ĐẾN BƯỚC ${activeStep}/4`;
        const staffMessage = `ĐƠN SỐ ${ticketID} ĐÃ XÉT DUYỆT ĐẾN BƯỚC ${activeStep}/4`;

        const studentEmailParams = {
          to_name: user.firstName + '' + user.lastName,
          from_name: "ĐHQG",
          message: studentMessage,
          reply_to: studentEmail,
          subject: `Xét duyệt đơn số: ${ticketID}`,
          to_email: studentEmail,
          approval_step: activeStep
        };

        const nextStaffEmailParams = {
          to_name: "NHÂN VIÊN",
          from_name: "ĐHQG",
          message: staffMessage,
          reply_to: StaffEmails,
          subject: "Có đơn cần duyệt mới",
          to_email: StaffEmails,
          ticket_id: `${ticketID}`,
        };
        const resultSendingMailToStudent = await sendEmailtoStudents(
          studentEmailParams
        );
        const resultSendingMailToStaff = await sendEmailtoStaffs(
          nextStaffEmailParams
        );
        if (resultSendingMailToStudent && resultSendingMailToStaff) {
          setSendmailSuccess(true);
        }
      })
      .catch((error) => console.log(error));
  }
  function handleUpdateNote() {
    if (note !== "") {
      axios
        .post(URL_SERVER_LOCAL+`/api/Ticket/updatePreviousNote`, { note, ticketID })
        .then(() => {
          setIsSuccess(true);
        });
    }
  }
  function handleNoteChange(event) {
    setNote(event.target.value);
  }

  function handleDisapprove() {
    if (note !== "") {
      axios
        .post(URL_SERVER_LOCAL+`/api/Ticket/disapproveTicket`, { ticketID, activeStep })
        .then(() => {
          axios.post(URL_SERVER_LOCAL+`/api/Ticket/updatePreviousNote`, {
            note,
            ticketID,
          });
        })
        .then(() => {
          setIsDisApproved(true);
          setIsCommitted(true);
        })
        .then(async () => {
          const studentEmail = await HandlegetStudentEmail();
          const studentMessage =
            "ĐƠN CỦA BẠN ĐÃ BỊ TỪ CHỐI, XIN HÃY ĐỌC NOTE TẠI TRANG WEB";
          const studentEmailParams = {
            to_name: user?.accountId,
            from_name: "ĐHQG",
            message: studentMessage,
            reply_to: studentEmail,
            subject: "Xét duyệt đơn" + ticketID,
            to_email: studentEmail,
          };

          const resultSendingMailToStudent = await sendEmailtoStudents(
            studentEmailParams
          );
          if (resultSendingMailToStudent) {
            setSendmailSuccess(true);
          }
        });
    } else {
      setNoteRequired(true);
      setTimeout(() => {
        setNoteRequired(false);
      }, 2000);
    }
  }
  return (
    <MainLayout>
      <div className={classes.ticketContainer}>
        <div className={classes.ticketProcess}>
          {isSuccess && <Notification message={NOTIFICATION.IS_APPROVED} />}
          {sendmailSuccess && (
            <Notification message={NOTIFICATION.IS_SENT_MAIL} />
          )}
          {noteRequired && (
            <Notification message={NOTIFICATION.IS_NOT_FILLED_NOTE} />
          )}
          {isCommitted && isDisApproved && (
            <Notification message={NOTIFICATION.IS_DISAPPROVED} />
          )}

          <p> Ticket Id: {ticketID}</p>

          <Box sx={{ maxWidth: 400 }}>
            <Stepper
              activeStep={activeStep}
              connector={<QontoConnector />}
              orientation="vertical"
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
              </Paper>
            )}
          </Box>
        </div>

        <div className="ticket-right-container">
          <div className={classes.ticketFormBox}>
            <h3> Form Information:</h3>
            {ticketData &&
              Object.entries(ticketData).map(([key, value]) => {

                console.log(key + ": " + value);
                if (typeof value === "string" && dayjs(value, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss'], true).isValid()) {
                  return (
                    <p key={key}>
                      <strong>{key}: </strong>
                      {dayjs(value).format(DATE_FORMAT)}
                    </p>
                  );
                } else {
                  return (
                    <p key={key}>
                      <strong>{key}: </strong> {value}
                    </p>
                  );
                }
              })}
          </div>

          <div className={classes.ticketInputBox}>
            <h3>Input from previous step:</h3>
            <p>{previousNote}</p>
          </div>

          <div className={classes.ticketOutputBox}>
            Output:
            <form onSubmit={handleNext}>
              Note*
              <textarea
                disabled={userDenied || isNext || isDisApproved}
                required
                onChange={handleNoteChange}
              />
              {/* GenDocx component */}
              {formData &&
                dynamicFormData &&
                activeStep === 3 &&
                !userDenied &&
                !isNext &&
                !isDisApproved && (
                  <GenDocx
                    formData={{ ...formData }}
                    dynamicFormData={{ ...dynamicFormData }}
                  />
                )}
              {/* Buttons */}
              {activeStep === steps.length ? null : (
                <div>
                  <Button
                    disabled={userDenied || isNext || isDisApproved}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Approve
                  </Button>

                  <Button
                    disabled={userDenied || isNext || isDisApproved}
                    sx={{ mt: 1, mr: 1 }}
                    onClick={handleDisapprove}
                  >
                    DisApprove
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
