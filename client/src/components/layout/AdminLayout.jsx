import { Box, Drawer, Grid, Stack, styled, Typography } from "@mui/material";
import {
  Close,
  Dashboard,
  ExitToApp,
  Group,
  ManageAccounts,
  Menu,
  Message,
} from "@mui/icons-material";
import IconBtn from "../shared/IconBtn";
import { useState } from "react";
import { useLocation, Link as LinkComponent, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/authAdmin";
import { orange, madiumOrange, lightOrange } from "../../constants/color";

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <Dashboard />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccounts />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <Group />,
  },
  {
    name: "Message",
    path: "/admin/messages",
    icon: <Message />,
  },
];

function AdminLayout({ children }) {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  function handleClose() {
    setIsMobile(false);
  }

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid
      container
      minHeight={"100vh"}
    >
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        {isMobile ? (
          <IconBtn
            title={"close"}
            icon={<Close />}
            onClick={handleMobile}
          />
        ) : (
          <IconBtn
            title={"menu"}
            icon={<Menu />}
            onClick={handleMobile}
          />
        )}
      </Box>

      <Grid
        item
        md={4}
        lg={3}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <SiderBar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{ bgcolor: "#f1f1f5" }}
      >
        {children}
      </Grid>
      <Drawer
        open={isMobile}
        onClose={handleClose}
      >
        <SiderBar w="50vw" />
      </Drawer>
    </Grid>
  );
}

export default AdminLayout;

const SiderBar = ({ w = "100%" }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  function handleLogOut() {
    console.log("logout");
    dispatch(adminLogout());
  }
  return (
    <Stack
      width={w}
      direction={"column"}
      p={"3rem"}
      spacing={"3rem"}
      sx={{
        backgroundColor: lightOrange,
        borderRadius: "1rem",
        border: `2px solid ${madiumOrange}`,
      }}
    >
      <Typography
        textAlign={"center"}
        variant="h4"
        textTransform={"uppercase"}
        sx={{ color: orange }}
      >
        Echo
      </Typography>

      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              textDecoration: "none",
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={"1rem"}
              p={"0.5rem 1rem"}
              sx={{
                borderRadius: "0.5rem",
                backgroundColor:
                  location.pathname === tab.path ? madiumOrange : "transparent",
                color: location.pathname === tab.path ? "#fff" : "#111",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: madiumOrange,
                  color: "wheat",
                },
              }}
            >
              {tab.icon}
              <Typography fontSize={"1rem"}>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link
          onClick={handleLogOut}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            p={"0.5rem 1rem"}
            sx={{
              borderRadius: "0.5rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: madiumOrange,
                color: "wheat",
              },
            }}
          >
            <ExitToApp sx={{ color: orange }} />
            <Typography fontSize={"1rem"}>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const Link = styled(LinkComponent)({
  textDecoration: "none",
  borderRadius: "2rem",
  color: "black",
  padding: "1rem 2rem",
  ":hover": {
    color: "rgba(0, 0, 0, 0.54)",
  },
});
