/* eslint-disable react/display-name */
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import { Drawer, Grid, Skeleton } from "@mui/material";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobileMenu } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/Hook.jsx";
import { getSocket } from "../../socket.jsx";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events.js";
import { incrementNotifications } from "../../redux/reducers/chat.js";

const AppLayout = () => {
  return (WrappedComponent) => {
    return (props) => {
      const InnerComponent = () => {
        const { isMobileMenu } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { isLoading, data, isError, error, refetch } =
          useMyChatsQuery("");

        const params = useParams();
        const chatId = params.chatId;
        const dispatch = useDispatch();
        const socket = getSocket();

        const newMessagesAlert = useCallback(() => {}, []);
        const newMessagesReq = useCallback(() => {
          dispatch(incrementNotifications());
        }, [dispatch]);

        const eventHandlers = {
          [NEW_MESSAGE_ALERT]: newMessagesAlert,
          [NEW_REQUEST]: newMessagesReq,
        };

        // call hook
        useSocketEvents(socket, eventHandlers);
        useErrors([{ isError, error }]);

        const handleDeleteChat = useCallback((e, _id, groupChat) => {
          // delete logic
          console.log("Deleting chat:", _id, groupChat);
        }, []);

        const handleMobileMenuClose = () => dispatch(setIsMobileMenu(false));
        return (
          <>
            <Title />
            <Header />

            {isLoading ? (
              <Skeleton />
            ) : (
              <Drawer open={isMobileMenu} onClose={handleMobileMenuClose}>
                <ChatList
                  w="70vw"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                />
              </Drawer>
            )}

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
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <ChatList
                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                <WrappedComponent {...props} user={user} chatId={chatId} />
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
