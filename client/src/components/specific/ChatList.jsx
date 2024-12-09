/* eslint-disable react/prop-types */
import { Stack } from "@mui/material";
import ChatItem from "../shared/ChatItem";

function ChatList({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) {
  return (
    <Stack width={w} overflow={"auto"} direction={"column"} height={"100%"}>
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((members) =>
          onlineUsers.includes(members)
        );

        return (
          <ChatItem
            index={index}
            key={_id}
            isOnline={isOnline}
            newMessageAlert={newMessageAlert}
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
}

export default ChatList;
