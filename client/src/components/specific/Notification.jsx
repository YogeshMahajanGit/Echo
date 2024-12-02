import { Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { sampleNotifi } from "../../constants/sampleData";
import NotificationItem from "./NotificationItem";

function Notification() {
  function handleFriendRequest({ _id, accept }) {
    console.log(_id, accept);
  }
  return (
    <Dialog open>
      <Stack padding={{ xs: "1rem", sm: "2rem" }} maxWidth={"35rem"}>
        <DialogTitle variant="h5" textAlign={"center"}>
          Notification
        </DialogTitle>
        {sampleNotifi.length > 0 ? (
          sampleNotifi.map((i, index) => (
            <NotificationItem
              sender={i.sender}
              _id={index}
              key={i._id}
              handler={handleFriendRequest}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notification!</Typography>
        )}
      </Stack>
    </Dialog>
  );
}

export default Notification;
