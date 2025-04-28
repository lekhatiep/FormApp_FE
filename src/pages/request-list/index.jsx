import { MainLayout } from "@components/layout";
import { TableList } from "@components/table-list";
import { columnsRequestList } from "@constants/data-test";
import { TicketContext } from "@contexts";
import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { APPROVAL_LIST, PERMISSIONS ,URL_SERVER_LOCAL} from "../../constants/common";

//---------------------------------------------------
const rowsRequestList = [];

//---------------------------------------------------
export const RequestList = () => {
  const [ticketInfo, setTicketInfo] = useState([]);
  const { getTicketInfo } = useContext(TicketContext);
  const token = localStorage.getItem("Token");

  //---------------------------------------------------
  const fetchTicketInfo = useCallback(async () => {
    try {
      const rs = await axios.get(URL_SERVER_LOCAL +"/api/Ticket/getTicketInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
         },
      });
      setTicketInfo(rs.data);
      getTicketInfo(rs.data); // Pass info to context
    } catch (err) {
      console.log("[fetchTicketInfo] | Get Error: ", err);
    }
  }, [getTicketInfo]);

  //---------------------------------------------------
  const rows = useMemo(() => {
    ticketInfo.map((item) => {
      rowsRequestList.push(item);
    });
    return rowsRequestList;
  }, [ticketInfo]);

  //---------------------------------------------------
  useEffect(() => {
    fetchTicketInfo();

    return () => {};
  }, []);

  //---------------------------------------------------
  return (
    <MainLayout>
      <TableList rows={rows} columns={columnsRequestList} name="Request List" />
    </MainLayout>
  );
};
