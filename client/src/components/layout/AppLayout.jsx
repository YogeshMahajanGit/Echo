/* eslint-disable react/display-name */
import React from "react";
import { useParams } from "react-router-dom";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import { Grid } from "@mui/material";
import { chatSample } from "../constants/sampleData";
import Profile from "../specific/Profile";

const AppLayout = () => {
  return (WrappedComponent) => {
    return (props) => {
      const InnerComponent = () => {
        const params = useParams();
        const chatId = params.chatId;

        const handleDeleteChat = React.useCallback((e, _id, groupChat) => {
          // delete logic
          console.log("Deleting chat:", _id, groupChat);
        }, []);

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
                <ChatList
                  chats={chatSample}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                lg={6}
                height={"100%"}
                bgcolor={"purple"}
              >
                <WrappedComponent {...props} />
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
                <Profile />
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
