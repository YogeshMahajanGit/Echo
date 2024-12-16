import {
  Avatar,
  Button,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";

function NotificationItem({ sender, _id, handler }) {
  const { name, avatar } = sender;

  return (
    <Paper
      variant="elevation"
      sx={{
        marginBottom: "10px",
        borderRadius: "5px",
      }}
    >
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
        >
          <Avatar src={avatar} />
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-flex",
              WebkitLineClamp: 1,
              wordBreak: "normal",
              width: "100%",
            }}
          >
            {name}
          </Typography>

          <Stack spacing={"10px"} direction={{ xs: "column", sm: "row" }}>
            <Button
              variant="contained"
              onClick={() => handler({ _id, accept: true })}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handler({ _id, accept: false })}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </Paper>
  );
}

export default memo(NotificationItem);
