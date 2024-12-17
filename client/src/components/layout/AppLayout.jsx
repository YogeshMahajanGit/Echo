/* eslint-disable react/display-name */

import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import { Drawer, Grid, Skeleton } from "@mui/material";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeleteMenu,
  setIsMobileMenu,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/Hook.jsx";
import { useSocket } from "../../socket.jsx";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "../../constants/events.js";
import {
  incrementNotifications,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { actionsFromLocalStorage } from "../../lib/features.js";
import DeleteChatMenu from "../dialogs/DeleteChatMenu.jsx";
import { lightOrange, madiumOrange, orange } from "../../constants/color.js";

const AppLayout = () => {
  return (WrappedComponent) => {
    return (props) => {
      const InnerComponent = () => {
        const params = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const socket = useSocket();
        const deleteMenuAnchor = useRef(null);
        const chatId = params.chatId;

        const { isMobileMenu } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);

        const { isLoading, data, isError, error, refetch } =
          useMyChatsQuery("");

        useEffect(() => {
          actionsFromLocalStorage({
            key: NEW_MESSAGE_ALERT,
            value: newMessagesAlert,
          });
        }, [newMessagesAlert]);

        // All event Listeners
        const newMessageAlertListener = useCallback(
          (data) => {
            if (data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
          },
          [chatId, dispatch]
        );

        const newRequestListener = useCallback(() => {
          dispatch(incrementNotifications());
        }, [dispatch]);

        const refetchListener = useCallback(() => {
          refetch();
          navigate("/");
        }, [refetch, navigate]);

        const eventHandlers = {
          [NEW_MESSAGE_ALERT]: newMessageAlertListener,
          [NEW_REQUEST]: newRequestListener,
          [REFETCH_CHATS]: refetchListener,
        };

        const handleDeleteChat = (e, chatId, groupChat) => {
          dispatch(setIsDeleteMenu(true));
          dispatch(setSelectedDeleteChat({ chatId, groupChat }));
          deleteMenuAnchor.current = e.currentTarget;
        };

        const handleMobileMenuClose = () => dispatch(setIsMobileMenu(false));

        // call hook
        useSocketEvents(socket, eventHandlers);
        useErrors([{ isError, error }]);

        return (
          <>
            <Title />
            <Header />

            <DeleteChatMenu
              dispatch={dispatch}
              deleteMenuAnchor={deleteMenuAnchor}
            />

            {isLoading ? (
              <Skeleton />
            ) : (
              <Drawer
                open={isMobileMenu}
                onClose={handleMobileMenuClose}
                sx={{
                  width: "80vw",
                  maxWidth: "400px",
                  background: lightOrange,
                  borderRight: `2px solid ${orange}`,
                }}
              >
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                />
              </Drawer>
            )}

            <Grid
              container
              sx={{ height: "calc(100vh - 4rem)", overflow: "hidden" }}
            >
              <Grid
                item
                sm={4}
                md={3}
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderRight: `2px solid ${lightOrange}`,
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  padding: "1rem",
                }}
              >
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    height="100%"
                  />
                ) : (
                  <ChatList
                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                  />
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                lg={6}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: lightOrange,
                  overflowY: "auto",
                  padding: "1.5rem",
                  border: `1px solid ${madiumOrange}`,
                }}
              >
                <WrappedComponent
                  {...props}
                  user={user}
                  chatId={chatId}
                />
              </Grid>

              <Grid
                item
                md={4}
                lg={3}
                sx={{
                  display: { xs: "none", md: "block" },
                  backgroundColor: "#fff",
                  borderLeft: `2px solid ${lightOrange}`,
                  boxShadow: `0 0 10px rgba(0, 0, 0, 0.05)`,
                  overflowY: "auto",
                  padding: "2rem",
                }}
              >
                <Profile user={user} />
              </Grid>
            </Grid>
          </>
        );
      };

      return <InnerComponent />;
    };
  };
};
export default AppLayout;
