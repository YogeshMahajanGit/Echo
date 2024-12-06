import { IconButton, Skeleton, Stack } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { useCallback, useRef, useState } from "react";
import { grayColor, orange } from "../constants/color";
import { AttachFile, Send } from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import bgImg from "../assets/wallapaper.jpeg";
import FileMenu from "../components/dialogs/FileMenu";
import Message from "../components/shared/Message";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useChatDetailsQuery, useGetMyMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/Hook";
import { useInfiniteScrollTop } from "6pp";

function ChatPage({ chatId, user }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const socket = getSocket();
  const containerRef = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const previousChatChuck = useGetMyMessagesQuery({ chatId, page });

  //Infinite Scroll
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    previousChatChuck.data?.totalPages,
    page,
    setPage,
    previousChatChuck.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: previousChatChuck.isError, error: previousChatChuck.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const newMessages = useCallback((data) => {
    setMessages((prev) => [...prev, data.message]);
  }, []);

  const eventHandle = { [NEW_MESSAGE]: newMessages };

  // call hook
  useSocketEvents(socket, eventHandle);
  useErrors(errors);

  // collect all messages
  const allMessages = [...oldMessages, ...messages];

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    // event trigger
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  }

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
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
        {allMessages.map((chat) => (
          <Message message={chat} user={user} key={chat._id} />
        ))}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={handleSubmit}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              ":focus": "0.8px solid red",
            }}
            placeholder="Type Message..."
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
