import { MainLayout } from "@components/layout";
import { dayjs } from "@utils/date";
import TableList from "@components/table-list";
import { columnsRequestList } from "@constants/data-test";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import UserContext from "@contexts/UserContext";
import { DATE_FORMAT, PERMISSIONS } from "@constants";
import { APPROVAL_LIST ,URL_SERVER_LOCAL} from "../../constants/common";

function RequestList() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(UserContext) ?? {};
  const [rowsRequestList, setRowsRequestList] = useState([]);

  const fetchTicketRequest = React.useCallback(async () => {
    axios.get(URL_SERVER_LOCAL +"/api/Ticket/getTicketInfo").then((res) => {
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
        if (user?.role !== PERMISSIONS.STUDENT) {
          return true;
        }

        return item.username.toLowerCase() === user.accountId.toLowerCase();
      });

      setRowsRequestList((prevData) => [...prevData, ...filteredData]);
      setIsLoaded(true);
    });
  }, [user]);

  useEffect(() => {
    fetchTicketRequest();
  }, [user]);

  return (
    <MainLayout>
      <div style={{ height: "90vh" }}>
        {isLoaded && rowsRequestList && (
          <TableList
            rows={rowsRequestList}
            columns={columnsRequestList}
            name="Request List"
          />
        )}
      </div>
    </MainLayout>
  );
}
export default RequestList;
