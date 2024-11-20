import Title from "../shared/Title";
import Header from "./Header";
import { Grid } from "@mui/material";

/* eslint-disable react/display-name */
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <Title />
        <Header />
        <Grid container sx={{ height: "calc(100vh - 4rem)" }}>
          <Grid
            height={"100%"}
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            first
          </Grid>
          <Grid xs={12} sm={8} md={5} lg={6} height={"100%"} bgcolor={"purple"}>
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "gray",
            }}
          >
            Third
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
