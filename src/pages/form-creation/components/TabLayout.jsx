import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormManagement from "../../../components/table-list/FormManagement";
import FormLinkManagement from "./FormLinkTable";
import {
  columnsFormManagement,
  columnsFormLinkManagement,
} from "@constants/data-test.js";
export function TabLayout(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="TabLayout"
      hidden={value !== index}
      id={`TabLayout-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

export default function BasicTabs(props) {
  const { rows, linkRows, setRows, setLinkRows, handleRefresh } = props ?? {};

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent={"space-between"}
        sx={{ borderBottom: 1, borderColor: "divider" }}
        px={1}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Dynamic Forms" id="tab-0" />
          <Tab label="Form Links" id="tab-1" />
        </Tabs>
      </Box>
      <TabLayout value={value} index={0}>
        <FormManagement
          handleRefresh={handleRefresh}
          rows={rows}
          setRows={setRows}
          columns={columnsFormManagement}
          name="Form Manament"
        />
      </TabLayout>

      <TabLayout value={value} index={1}>
        <FormLinkManagement
          handleRefresh={handleRefresh}
          rows={linkRows}
          setLinkRows={setLinkRows}
          columns={columnsFormLinkManagement}
          name="Form Manament"
        />
      </TabLayout>
    </Box>
  );
}
