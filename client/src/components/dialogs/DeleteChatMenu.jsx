/* eslint-disable react/prop-types */
import { Button, Menu, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { Delete, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/Hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { useEffect } from "react";

function DeleteChatMenu({ dispatch, deleteMenuAnchor }) {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatdata] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const handleclose = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const handleLeaveGroup = () => {
    handleclose();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };
  const handleDeleteChat = () => {
    handleclose();
    deleteChat("Deleting chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatdata || leaveGroupData) navigate("/");
  }, [deleteChatdata, leaveGroupData, navigate]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={handleclose}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        sx={{
          width: "9rem",
          padding: "0.3rem",
        }}
      >
        {selectedDeleteChat.groupChat ? (
          <Button
            endIcon={<ExitToApp />}
            onClick={handleLeaveGroup}
            color="error"
            variant="text"
            size="small"
          >
            Leave group
          </Button>
        ) : (
          <Button
            endIcon={<Delete />}
            onClick={handleDeleteChat}
            color="error"
            variant="text"
            size="small"
          >
            Delete Chat
          </Button>
        )}
      </Stack>
    </Menu>
  );
}

export default DeleteChatMenu;
