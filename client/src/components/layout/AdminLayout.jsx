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

const Link = styled(LinkComponent)({
  textDecoration: "none",
  borderRadius: "2rem",
  color: "black",
  padding: "1rem 2rem",
  ":hover": {
    color: "rgba(0, 0, 0, 0.54)",
  },
});
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

const SiderBar = ({ w = "100%" }) => {
  const location = useLocation();

  function handleLogOut() {
    console.log("log out");
  }
  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography textAlign={"center"} variant="h4" textTransform={"uppercase"}>
        Echo
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: "black",
                color: "white",
                ":hover": { color: "wheat" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography fontSize={"1rem"}>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={handleLogOut}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToApp />
            <Typography fontSize={"1rem"}>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const isAdmin = true;

/* eslint-disable react/prop-types */
function AdminLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  function handleClose() {
    setIsMobile(false);
  }

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        {isMobile ? (
          <IconBtn title={"close"} icon={<Close />} onClick={handleMobile} />
        ) : (
          <IconBtn title={"menu"} icon={<Menu />} onClick={handleMobile} />
        )}
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SiderBar />
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: "#f1f1f5" }}>
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <SiderBar w="50vw" />
      </Drawer>
    </Grid>
  );
}

export default AdminLayout;
