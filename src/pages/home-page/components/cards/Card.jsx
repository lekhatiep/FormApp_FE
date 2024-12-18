import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import webLogo from "../../../../assets/Logo.png";

export const CardForm = (props) => {
  const { data, handleViewForm } = props ?? {};
  return (
    <div
      onClick={handleViewForm}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      <Tooltip title={data?.name ?? ""} placement="top">
        <Card
          sx={{
            minWidth: 150,
            maxWidth: 345,
            marginLeft: "10px",
            padding: "10px 5px",
          }}
        >
          <CardMedia
            sx={{
              height: 100,
              backgroundPosition: "center",
              backgroundSize: "100px",
            }}
            image={webLogo}
            title="External Form Link"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data?.name ?? ""}
            </Typography>
          </CardContent>
        </Card>
      </Tooltip>
    </div>
  );
};
