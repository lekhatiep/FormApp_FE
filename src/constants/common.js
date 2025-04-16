export const PERMISSIONS = {
  STUDENT: "student",
  ADMIN: "admin",
  VERIFIER: "verifier",
  APPROVER: "approver",
  EXECUTOR: "executor",
  MANAGER: "manager",
  ADMIN: "admin",
};

export const TICKET_STATUS = {
  WAITING: "waiting",
  UPDATE: "update",
};

export const DATE_FORMAT = "DD-MM-YYYY HH:mm";
export const MAX_TIME_FORMAT = "MM:YYYY";
export const BIRTHDATE_FORMAT = "DD/MM/YYYY";
export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
export const LOGIN_PAGE = "/";
export const REQUEST_DYNAMIC_FORM = "/request-dynamic";
export const REQUEST_LIST = "/request-list";
export const APPROVAL_LIST = "/approval-list";
export const FORM_CREATION = "/form-creation";
export const HOME_PAGE = "/home-page";
export const VIEW_TICKET = "/ticket-page/:id";
export const UPDATE_TICKET = "/update-ticket/:id";
export const NOT_FOUND = "*";
export const FORGOT_PASSWORD = "/forgot_password";

export const NOTIFICATION = {
  IS_DELETED: "Deleted Successfully",
  IS_SUBMITTED: "Submitted Successfully ",
  IS_MODIFIED: "Modified Form Successfully ",
  IS_APPROVED: "Approved Successfully",
  IS_SENT_MAIL: "Sent mail successfully",
  IS_NOT_FILLED_NOTE: "Please fill out Note",
  IS_NOT_SELECTED_FILE: "No file selected",
  IS_DISAPPROVED: "Disapproved Successfully",
  IS_UNCHANGED: "You did not change any input",
  IS_UPDATED: "Updated successfully",
};

export const ROW_PER_PAGE = [3, 5, 10];

 //export const URL_SERVER_LOCAL = "http://localhost:8080";
//export const URL_SERVER_LOCAL = "http://localhost:5001";
export const URL_SERVER_LOCAL = "https://api.bieumaulvtn.fun";
