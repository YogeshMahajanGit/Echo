/* eslint-disable react-refresh/only-export-components */
import { Box, Typography } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import bgImg from "../assets/wallapaper.jpeg";
// import CardMedia from "@mui/material/CardMedia";

function HomePage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImg})`,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Typography
        color="textDisabled"
        padding={"2rem"}
        variant="h2"
        textAlign={"center"}
      >
        <Box marginTop={"12rem"}>Select Chat To Send Meassage</Box>
      </Typography>
    </Box>
  );
}

export default AppLayout()(HomePage);
