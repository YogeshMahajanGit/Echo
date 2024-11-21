import { lazy, Suspense, useState } from "react";
import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Add,
  Group,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Search,
} from "@mui/icons-material";
import { orange } from "../constants/color";
import { useNavigate } from "react-router-dom";
import IconBtn from "../shared/IconBtn";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notification"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

function Header() {
  const navigate = useNavigate();

  //   const [mobile, setMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);

  function handleMobile() {}
  function handleOpenSearchDialog() {
    setIsSearch((prev) => !prev);
  }
  function handleOpenNewGroup() {}
  function handleNotifications() {}
  function handleLogout() {}

  function handleNaviagteGroup() {
    navigate("/groups");
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Echo
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<Search />}
                onClick={handleOpenSearchDialog}
              />
              <IconBtn
                title={"New Group"}
                icon={<Add />}
                onClick={handleOpenNewGroup}
              />
              <IconBtn
                title={"Manahe Groups"}
                icon={<Group />}
                onClick={handleNaviagteGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<Notifications />}
                onClick={handleNotifications}
              />
              <IconBtn
                title={"Logout"}
                icon={<Logout />}
                onClick={handleLogout}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {/* {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )} */}
      {isNotification && (
        <Suspense fallback={<h1>LODDD..</h1>}>
          <NotificationDialog />
        </Suspense>
      )}{" "}
      {isNewGroup && (
        <Suspense fallback={<h1>LODDD..</h1>}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
}

export default Header;
