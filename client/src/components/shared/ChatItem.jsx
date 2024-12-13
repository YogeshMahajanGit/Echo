/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "../styles/StyledComponents";
import { memo } from "react";
import AvatarCard from "./AvatarCard";
import { lightOrange } from "../../constants/color";
import { orange } from "@mui/material/colors";
import { motion } from "motion/react";

function ChatItem({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) {
  return (
    <Link
      sx={{ padding: "0.3rem 0.5rem", marginTop: "1rem" }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "flex",
          gap: "1.2rem",
          alignItems: "center",
          backgroundColor: sameSender ? `${lightOrange}` : "",
          padding: "0.3rem",
          color: "black",
          position: "relative",
          borderRadius: "0.6rem",
          border: sameSender ? `1px solid ${orange}` : "",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleDeleteChat(e, _id, groupChat);
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          ></Box>
        )}
      </motion.div>
    </Link>
  );
}

export default memo(ChatItem);
