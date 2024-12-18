import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import webLogo from "../../../../assets/Logo.png";
import { useCallback } from "react";

export const InfoCard = (props) => {
  console.log(props?.info.formLinkUrl);
  
  const {
    formLinkDescription: formLinkDescription,
    formLinkUrl: formLinkUrl,
    formLinkName: formLinkName,
  } = props?.info ?? {};

  
  const handleLinkClick = useCallback(() => {
    
    window.open(formLinkUrl, "_blank");
  }, [formLinkUrl]);

  return (
    <div
      onClick={handleLinkClick}
      style={{ cursor: "pointer", maxWidth: "25rem" }}
    >
      <Tooltip title={formLinkDescription ?? ""} placement="top">
        <Card
          sx={{
            minWidth: 150,
            maxWidth: 290,
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
              {formLinkName ?? ""}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              overflow={"hidden"}
              width={"100%"}
              height={"2.5rem"}
            >
              {formLinkDescription ?? ""}
            </Typography>
          </CardContent>
        </Card>
      </Tooltip>
    </div>
  );
};
