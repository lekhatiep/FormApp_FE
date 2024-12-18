import { CardForm, InfoCard } from "./components/cards";
import { Grid, Box, MenuItem, Select, TextField } from "@mui/material";
import { MainLayout } from "@components/layout";
import { LOCAL_BASE_URL } from "@constants/api-path";
import { REQUEST_DYNAMIC_FORM } from "@constants/common";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { APPROVAL_LIST, PERMISSIONS ,URL_SERVER_LOCAL} from "../../constants/common";

const useStyles = makeStyles(() => ({
  homepageContainer: {
    marginTop: "4.25rem",
    marginLeft: "13rem",
    backgroundColor: "#F5F5F5",
    minHeight: "50rem",
    paddingBottom: "10rem",
  },
  homepageName: {
    fontWeight: 700,
    fontSize: "3.125rem",
    marginLeft: "2.25rem",
  },
  homepageInfo: {
    width: "90%",
    margin: "0 auto",
    padding: "0 1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  homepageCatalogueContainer: {
    display: "flex",
  },
  homepageServiceContainer: {
    width: "80%",
    margin: "1.25rem auto",
  },
  homepageServiceBtn: {
    margin: "0.625rem",
    display: "inline-block",
  },
  homepageServiceLink: {
    color: "white",
    textDecoration: "none",
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const [dynamicForm, setDynamicForm] = useState();
  const [formLink, setFormLink] = useState();
  const [formTypes, setFormTypes] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    if (event.target.value.length > 0) {
      setIsSearching(true);
      const value = event.target.value;
      const filteredDynamicForm = dynamicForm.filter((item) => {
        return item.form_name.toLowerCase().includes(value.toLowerCase());
      });
      const filteredFormLink = formLink.filter((item) => {
        return item.form_link_name.toLowerCase().includes(value.toLowerCase());
      });
      const combinedResults = [...filteredDynamicForm, ...filteredFormLink];
      setSearchResult(combinedResults);
    } else {
      setIsSearching(false);
      setSearchResult([]);
    }
  };

  const fetchDynamicForm = useCallback(() => {
    axios
      .get(`${URL_SERVER_LOCAL}/api/Form/getDynamicFormList`)
      .then((res) => {
        setDynamicForm(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const fetchFormLink = useCallback(() => {
    axios
      .get(`${URL_SERVER_LOCAL}/api/Form/getFormLinkList`)
      .then((res) => {
        setFormLink(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleViewForm = useCallback((props) => {
    navigate(REQUEST_DYNAMIC_FORM, { state: props });
  }, []);

  useEffect(() => {
    fetchDynamicForm();
    fetchFormLink();
  }, [fetchFormLink, fetchDynamicForm]);

  const ListForms = () => {
    switch (formTypes) {
      case "cse": {
        return (
          <div className={classes.homepageServiceContainer}>
            <h2>From CSE</h2>
            <Box display="flex" flexWrap="wrap" p={2}>
              {dynamicForm &&
                dynamicForm?.map((item, index) => {
                  const {
                    form_name: formName,
                    form_data: formData,
                    form_id: formId,
                  } = item ?? {};
                  const props = {
                    name: formName,
                    data: formData,
                    formId: formId,
                  };
                  return (
                    <div className={classes.homepageServiceBtn} key={index}>
                      <CardForm
                        data={props}
                        handleViewForm={() => handleViewForm(props)}
                      />
                    </div>
                  );
                })}
            </Box>
          </div>
        );
      }
      case "others": {
        return (
          <React.Fragment>
            {formTypes === "all" && <hr />}
            <div className={classes.homepageServiceContainer}>
              <h2>From other pages</h2>
              {formLink && (
                <Box display="flex" flexWrap="wrap" p={2} sx={{ gap: "10px" }}>
                  {formLink?.map((item, index) => {
                    return <InfoCard key={index} info={item} />;
                  })}
                </Box>
              )}
            </div>
          </React.Fragment>
        );
      }
      default: {
        return (
          <React.Fragment>
            <div className={classes.homepageServiceContainer}>
              <h2>From CSE</h2>
              <Box display="flex" flexWrap="wrap" p={2}>
                {dynamicForm &&
                  dynamicForm?.map((item, index) => {
                    const {
                      form_name: formName,
                      form_data: formData,
                      form_id: formId,
                    } = item ?? {};
                    const props = {
                      name: formName,
                      data: formData,
                      formId: formId,
                    };
                    return (
                      <div className={classes.homepageServiceBtn} key={formId}>
                        <CardForm
                          data={props}
                          handleViewForm={() => handleViewForm(props)}
                        />
                      </div>
                    );
                  })}
              </Box>
            </div>
            {formTypes === "all" && <hr />}
            <div className={classes.homepageServiceContainer}>
              <h2>From other pages</h2>
              {formLink && (
                <Box display="flex" flexWrap="wrap" p={2} sx={{ gap: "10px" }}>
                  {formLink?.map((item, index) => {
                    return <InfoCard key={index} info={item} />;
                  })}
                </Box>
              )}
            </div>
          </React.Fragment>
        );
      }
    }
  };

  const SearchResults = () => {
    return (
      <div className={classes.homepageServiceContainer}>
        <h2>Search Result</h2>
        {searchResult && (
          <Box display="flex" flexWrap="wrap" p={2}>
            {searchResult?.map((item) => {
              if (item.hasOwnProperty("form_name")) {
                const { form_name, form_data, form_id } = item ?? {};
                const props = {
                  name: form_name,
                  data: form_data,
                  formId: form_id,
                };
                return (
                  <CardForm
                    data={props}
                    handleViewForm={() => handleViewForm(props)}
                    key={props.formId}
                  />
                );
              } else return <InfoCard info={item} key={item.form_link_id} />;
            })}
          </Box>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className={classes.homepageContainer}>
        <Grid container item xs={false}>
          <Grid item xs={12}>
            <h1 className={classes.homepageName}>Services</h1>
          </Grid>
          <Grid item ml={2} xs={2}>
            <Select
              labelId="status-label"
              size="small"
              fullWidth
              id="status"
              placeholder="All"
              defaultValue="all"
              onChange={(value) => {
                setFormTypes(value.target.value);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="cse">From CSE</MenuItem>
              <MenuItem value="others">From Other Pages</MenuItem>
            </Select>
          </Grid>
          <Grid ml={2} item xs={2}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              placeholder="Find Services from..."
              size="small"
              onChange={(event) => {
                handleSearch(event);
              }}
            />
          </Grid>
        </Grid>

        {isSearching && searchResult.length > 0 ? (
          <SearchResults />
        ) : (
          <ListForms />
        )}
      </div>
    </MainLayout>
  );
};
