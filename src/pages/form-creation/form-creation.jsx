import React, { useCallback, useEffect, useState } from "react";
import { MainLayout } from "../../components/layout";
import { Button } from "@mui/material";
import BasicModal from "./components/FormCreatePopup";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import BasicTabs from "./components/TabLayout";
import { makeStyles } from "@mui/styles";
import { APPROVAL_LIST, PERMISSIONS ,URL_SERVER_LOCAL} from "../../constants/common";
const useStyles = makeStyles(() => ({
  formContainer: {
    marginTop: "4.25rem",
    marginLeft: "13rem",
    backgroundColor: "#F5F5F5",
  },
  formName: {
    fontWeight: 700,
    fontSize: "3.125rem",
    marginLeft: "2.25rem",
  },
  formTitle: {
    display: "flex",
    padding: "0.625rem",
    justifyContent: "space-between",
    width: "50%",
    alignItems: "center",
  },
  formServiceLink: {
    display: "block",
    height: "2.8125rem",
    color: "white",
    textDecoration: "none",
  },
}));

export const FormCreation = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [linkRows, setLinkRows] = useState([]);
  const [newForm, setNewForm] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const handleCloseForm = useCallback(() => {
    setNewForm(false);
  }, []);
  const handleRefresh = useCallback(() => {
    setRefresh(true);
  }, []);
  useEffect(() => {
    if (!refresh) {
      return;
    }
    axios
      .get(URL_SERVER_LOCAL+ "/api/Form/getDynamicFormList")
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(URL_SERVER_LOCAL+ "/api/Form/getFormLinkList")
      .then((res) => {
        setLinkRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setRefresh(false);
  }, [refresh]);

  return (
    <div>
      <MainLayout>
        <div className={classes.formContainer}>
          <div className={classes.formTitle}>
            <h1 className={classes.formName}>Form Management</h1>
            <Button
              variant="contained"
              className={classes.formServiceLink}
              onClick={() => setNewForm(true)}
            >
              <AddIcon />
            </Button>

            {newForm && (
              <BasicModal
                handleCloseForm={handleCloseForm}
                handleRefresh={handleRefresh}
              />
            )}
          </div>
          <div>
            {rows.length >= 0 && linkRows.length >= 0 && (
              <BasicTabs
                rows={rows}
                setRows={setRows}
                linkRows={linkRows}
                setLinkRows={setLinkRows}
                handleRefresh={handleRefresh}
              />
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};
