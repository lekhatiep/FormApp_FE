import { MainLayout } from "@components/layout";
import TableList from "@components/table-list";
import { PERMISSIONS } from "@constants";
import { columnsApprovalList } from "@constants/data-test";
import UserContext from "@contexts/UserContext";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { dayjs } from "@utils/date";
import { DATE_FORMAT } from "@constants";
import { APPROVAL_LIST ,URL_SERVER_LOCAL} from "../../constants/common";

export const ApprovalList = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(UserContext) ?? "";
  const [rowsApprovalList, SetRowsApprovalList] = useState([]);
  const token = localStorage.getItem("Token");

  const fetchTicketInfo = useCallback(() => {
    axios
      .get(URL_SERVER_LOCAL +"/api/Ticket/getTicketInfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
           },
        }
      )
      
      .then((res) => {
        const formattedData = res.data.map((item) => {
         
          return {
            activeStep: item?.active_step,
            dateApproved: item?.date_approved
              ? dayjs(item?.date_approved).format(DATE_FORMAT)
              : "-",
            dateCreated: item?.date_created
              ? dayjs(item?.date_created).format(DATE_FORMAT)
              : "-",
            formName: item?.form_name,
            note: item.note ?? "-",
            status: item.status,
            ticketId: item?.ticket_id,
            username: item?.username,
          };
        });

        const filteredData = formattedData.filter((item) => {
          if (user?.role === PERMISSIONS.STUDENT) {
            return item.username === user?.accountId;
          }

          return true;
        });

        SetRowsApprovalList((prevData) => [...prevData, ...filteredData]);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchTicketInfo();
  }, [fetchTicketInfo]);

  return (
    <MainLayout>
      <div style={{ height: "120vh" }}>
        {isLoaded && (
          <TableList
            rows={rowsApprovalList}
            columns={columnsApprovalList}
            name="Approval List"
          />
        )}
      </div>
    </MainLayout>
  );
};
