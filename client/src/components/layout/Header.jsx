import { lazy, Suspense } from "react";
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
import { orange } from "../../constants/color";
import { useNavigate } from "react-router-dom";
import IconBtn from "../shared/IconBtn";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotifications } from "../../redux/reducers/chat";
import { Link } from "react-router-dom";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notification"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

function Header() {
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const handleOpenSearchDialog = () => dispatch(setIsSearch(true));

  const handleNotifications = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotifications());
  };

  function handleOpenNewGroup() {
    dispatch(setIsNewGroup(true));
  }

  async function handleLogout() {
    try {
      const { data } = await axios.get(`${server}/api/v1/users/logout`, {
        withCredentials: true,
      });

      // dispatch logout event
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  function handleNaviagteGroup() {
    navigate("/groups");
  }

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        height={"4rem"}
      >
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton
                color="inherit"
                onClick={handleMobile}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Link
              to="/"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: { xs: "none", sm: "block" },
                  letterSpacing: "0.2rem",
                  fontSize: { xs: "20px", sm: "1.8rem" },
                  fontWeight: "600",
                  cursor: "pointer",
                  marginLeft: "1rem",
                }}
              >
                Echo
              </Typography>
            </Link>

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
                title={"Manage Groups"}
                icon={<Group />}
                onClick={handleNaviagteGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<Notifications />}
                onClick={handleNotifications}
                value={notificationCount}
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
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
}

export default Header;
