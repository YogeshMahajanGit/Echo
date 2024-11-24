import { Add, Remove } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";

function UserItem({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) {
  const { name, _id, avatar } = user;
  return (
    <Paper
      variant="elevation"
      sx={{
        marginBottom: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        ":hover": {
          bgcolor: "#0001",
        },
      }}
    >
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
          {...styling}
        >
          <Avatar />
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-flex",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {name}
          </Typography>
          <IconButton
            size="small"
            sx={{
              bgcolor: isAdded ? "error.main" : "primary.main",
              color: "white",
              ":hover": {
                bgcolor: isAdded ? "error.dark" : "primary.dark",
              },
            }}
            onClick={() => handler(_id)}
            disabled={handlerIsLoading}
          >
            {isAdded ? <Remove /> : <Add />}
          </IconButton>
        </Stack>
      </ListItem>
    </Paper>
  );
}

export default memo(UserItem);
