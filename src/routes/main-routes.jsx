import {
  APPROVAL_LIST,
  FORM_CREATION,
  HOME_PAGE,
  LOGIN_PAGE,
  NOT_FOUND,
  REQUEST_DYNAMIC_FORM,
  REQUEST_LIST,
  UPDATE_TICKET,
  VIEW_TICKET
} from "@constants/common";
import { ApprovalList } from "@pages/approval-list/approval-list";
import { FormCreation } from "@pages/form-creation/form-creation";
import { HomePage } from "@pages/home-page";
import LandingPage from "@pages/login-page/LoginPage";
import NotFound from "@pages/not-found/not-found";
import RequestList from "@pages/request-list/request-list";
import RequestDynamicForm from "@pages/request-page/request-dynamic-page";
import TicketPage from "@pages/ticket/ticket-page";
import UpdatePage from "@pages/update-ticket/UpdatePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "./admin-routes";
import { StaffRoute } from "./staff-routes";

const CommonRoutes = [
  { path: LOGIN_PAGE, element: <LandingPage /> },
  { path: HOME_PAGE, element: <HomePage /> },
  { path: REQUEST_DYNAMIC_FORM, element: <RequestDynamicForm /> },
  { path: REQUEST_LIST, element: <RequestList /> },
  { path: VIEW_TICKET, element: <TicketPage /> },
  { path: UPDATE_TICKET, element: <UpdatePage /> },
  { path: NOT_FOUND, element: <NotFound /> },
]
export const MainRoute = () => {
  return (
    <Routes>
      {CommonRoutes.map((el) => {
        const { path, element } = el ?? {}
        return (
          <Route key={path} path={path} element={element} />
        )
      })}
      <Route
        path={APPROVAL_LIST}
        element={
          <StaffRoute>
            <ApprovalList />
          </StaffRoute>
        }
      />
      <Route
        path={FORM_CREATION}
        element={
          <AdminRoute>
            <FormCreation />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

