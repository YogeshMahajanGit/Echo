import { memo } from "react";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";
import { Stack, Typography } from "@mui/material";

function GroupItem({ group, chatId }) {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"1rem"}
        sx={{}}
      >
        <AvatarCard avatar={avatar} />
        <Typography
          // fontSize=
          fontSize={{ xs: "1rem", sm: "1.8rem" }}
          fontWeight={"600"}
        >
          {name}
        </Typography>
      </Stack>
    </Link>
  );
}

export default memo(GroupItem);
