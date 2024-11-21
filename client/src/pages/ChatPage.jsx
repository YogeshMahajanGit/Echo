import { IconButton, Stack } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { useRef } from "react";
import { grayColor, orange } from "../components/constants/color";
import { AttachFile, Send } from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import bgImg from "../assets/wallapaper.jpeg";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage } from "../components/constants/sampleData";
import Message from "../components/shared/Message";

const user = {
  _id: "dddd",
  name: "yogesh",
};

function ChatPage() {
  const containerRef = useRef(null);

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          backgroundImage: `url(${bgImg})`,
          width: "100%",
          height: "90%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {sampleMessage.map((chat) => (
          <Message message={chat} user={user} key={chat._id} />
        ))}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          position={"relative"}
          alignItems={"center"}
          padding={"0.8rem"}
          spacing={1}
        >
          <IconButton>
            <AttachFile />
          </IconButton>
          <InputBox
            sx={{
              ":focus": "0.8px solid red",
            }}
            placeholder="Type Message"
          />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: orange,
              color: "white",
              padding: "0.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <Send />
          </IconButton>
        </Stack>
        <FileMenu />
      </form>
    </>
  );
}

export default AppLayout()(ChatPage);
