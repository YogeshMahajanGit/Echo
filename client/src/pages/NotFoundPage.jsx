import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
function NotFoundPage() {
  return (
    <Container
      maxWidth="lg"
      sx={{ height: "100vh" }}
    >
      <Stack
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
        height={"100%"}
      >
        <img
          width={"40%"}
          src="https://i.imgur.com/qIufhof.png"
        />
        <Typography variant="h1">404 !</Typography>
        <Typography variant="h4">This page could not be found</Typography>
        <Link to="/">{"<<<"} Go back to home</Link>
      </Stack>
    </Container>
  );
}

export default NotFoundPage;
