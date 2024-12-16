import {
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NotificationItem from "./NotificationItem";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { useAsyncMutation, useErrors } from "../../hooks/Hook";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function Notification() {
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const dispatch = useDispatch();

  async function handleFriendRequest({ _id, accept }) {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting..",{ requestId: _id, accept });
  }

  const handleCloseDialog = () => dispatch(setIsNotification(false));

  // handle error
  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={handleCloseDialog}>
      <Stack padding={{ xs: "1rem", sm: "2rem" }} maxWidth={"35rem"}>
        <DialogTitle variant="h5" textAlign={"center"}>
          Notification
        </DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allNotifications?.length > 0 ? (
              data?.allNotifications?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  key={_id}
                  handler={handleFriendRequest}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No Notification!</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
}

export default Notification;
