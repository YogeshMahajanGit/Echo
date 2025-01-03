/* eslint-disable react/display-name */

import { useCallback, useEffect, useRef, useState } from "react";
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
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events.js";
import {
  incrementNotifications,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { actionsFromLocalStorage } from "../../lib/features.js";
import DeleteChatMenu from "../dialogs/DeleteChatMenu.jsx";

const AppLayout = () => {
  return (WrappedComponent) => {
    return (props) => {
      const InnerComponent = () => {
        const [onlineUsers, setOnlineUsers] = useState([]);

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

        const userOnlineListener = useCallback((data) => {
          setOnlineUsers(data);
        }, []);

        const refetchListener = useCallback(() => {
          refetch();
          navigate("/");
        }, [refetch, navigate]);

        const eventHandlers = {
          [NEW_MESSAGE_ALERT]: newMessageAlertListener,
          [NEW_REQUEST]: newRequestListener,
          [REFETCH_CHATS]: refetchListener,
          [ONLINE_USERS]: userOnlineListener,
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
              >
                <ChatList
                  w="70vw"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </Drawer>
            )}

            <Grid
              container
              sx={{ height: "calc(100vh - 4rem)" }}
            >
              <Grid
                height={"100%"}
                item
                sm={4}
                md={3}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <ChatList
                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                lg={6}
                height={"100%"}
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
                height={"100%"}
                sx={{
                  display: { xs: "none", md: "block" },
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
