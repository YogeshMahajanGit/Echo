import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  AdminPanelSettings,
  Group,
  Message,
  Notifications,
  Person,
} from "@mui/icons-material";
import moment from "moment";
import { SearchField } from "../../components/styles/StyledComponents";
import { CurveButton } from "../../components/styles/StyledComponents";
import { DoughnutChart, LineChart } from "../../components/specific/Chart";

function Dashboard() {
  return (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{
            xs: "center",
            lg: "stretch",
          }}
          sx={{ gap: "2rem" }}
        >
          <Paper
            elevation={2}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>
            <LineChart value={[2, 5, 32, 4, 33]} />
          </Paper>

          <Paper
            elevation={2}
            sx={{
              position: "relative",
              padding: "1rem",
              borderRadius: "1rem",
              width: { xs: "100%", sm: "50%" },
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              maxWidth: "25rem",
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[23, 66]}
            />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <Group />
              <Typography>Vs</Typography>
              <Person />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  );
}

export default Dashboard;

const Widget = ({ title, value, icon }) => (
  <Paper
    elevation={2}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "#111",
          borderRadius: "50%",
          border: "4px solid #000",
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack>
        {icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

const Widgets = (
  <Stack
    direction={{
      xs: "column",
      sm: "row",
    }}
    spacing={"2rem"}
    justifyContent={"space-between"}
    alignItems={"center"}
    margin={"2rem 0"}
  >
    <Widget title={"Users"} value={34} icon={<Person />} />
    <Widget title={"Chats"} value={4} icon={<Group />} />
    <Widget title={"Messages"} value={43} icon={<Message />} />
  </Stack>
);

const Appbar = (
  <Paper
    elevation={2}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem",
    }}
  >
    <Stack direction={"row"} alignItems={"center"} spacing={2}>
      <AdminPanelSettings sx={{ fontSize: "3rem" }} />

      <SearchField placeholder="Search..." />
      <CurveButton>Search</CurveButton>

      <Box flexGrow={1} />
      <Typography
        display={{
          xs: "none",
          lg: "block",
        }}
        textAlign={"center"}
        color={"rgba(0,0,0,0.7)"}
      >
        {moment().format("dddd,D MMMM YYYY")}
      </Typography>
      <Notifications />
    </Stack>
  </Paper>
);
