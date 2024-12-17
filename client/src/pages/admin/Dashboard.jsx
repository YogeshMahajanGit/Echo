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
import LoadingGrid from "../../components/shared/LoadingGrid";
import { useGetAdminStatesQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/Hook";
import { orange, madiumOrange, lightOrange } from "../../constants/color";

function Dashboard() {
  const { data, isLoading, error } = useGetAdminStatesQuery();

  const { stats } = data || {};

  useErrors([{ isError: error, error: error }]);

  return isLoading ? (
    <LoadingGrid />
  ) : (
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
              padding: "2rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
              backgroundColor: lightOrange,
            }}
          >
            <Typography
              margin={"2rem 0"}
              variant="h5"
              sx={{ color: orange, textAlign: "center" }}
            >
              Last Messages
            </Typography>
            <LineChart value={stats?.messageChart || []} />
          </Paper>

          <Paper
            elevation={2}
            sx={{
              position: "relative",
              padding: "1rem",
              borderRadius: "1rem",
              width: { xs: "100%", sm: "50%" },
              maxWidth: "25rem",
              backgroundColor: "#fff",
              border: `2px solid ${madiumOrange}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[
                stats?.totalChatsCount - stats?.groupsCount || 0,
                stats?.groupsCount || 0,
              ]}
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
              <Typography color={orange}>Vs</Typography>
              <Person />
            </Stack>
          </Paper>
        </Stack>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={"2rem"}
          justifyContent={"space-between"}
          alignItems={"center"}
          margin={"2rem 0"}
          flexWrap={"wrap"}
        >
          <Widget
            title={"Users"}
            value={stats?.usersCount || 0}
            icon={<Person sx={{ color: madiumOrange }} />}
          />
          <Widget
            title={"Chats"}
            value={stats?.totalChatsCount || 0}
            icon={<Group sx={{ color: madiumOrange }} />}
          />
          <Widget
            title={"Messages"}
            value={stats?.messagesCount || 0}
            icon={<Message sx={{ color: madiumOrange }} />}
          />
        </Stack>
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
      borderRadius: "1.5rem",
      width: "100%",
      maxWidth: "20rem",
      textAlign: "center",
      backgroundColor: lightOrange,
      border: `2px solid ${orange}`,
    }}
  >
    <Stack
      alignItems={"center"}
      spacing={"1rem"}
    >
      <Box
        sx={{
          color: "#111",
          borderRadius: "50%",
          border: `4px solid ${madiumOrange}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
        }}
      >
        {value}
      </Box>
      <Stack>
        {icon}
        <Typography
          variant="subtitle1"
          color={orange}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

const Appbar = (
  <Paper
    elevation={2}
    sx={{
      padding: "1rem 2rem",
      margin: "2rem 0",
      borderRadius: "1rem",
      backgroundColor: lightOrange,
    }}
  >
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={2}
      flexWrap={"wrap"}
    >
      <AdminPanelSettings sx={{ fontSize: "3rem", color: orange }} />

      <SearchField placeholder="Search..." />
      <CurveButton sx={{ backgroundColor: madiumOrange }}>Search</CurveButton>

      <Box flexGrow={1} />
      <Typography
        display={{
          xs: "none",
          lg: "block",
        }}
        textAlign={"center"}
        color={"rgba(0,0,0,0.7)"}
      >
        {moment().format("dddd, D MMMM YYYY")}
      </Typography>
      <Notifications sx={{ color: madiumOrange }} />
    </Stack>
  </Paper>
);
