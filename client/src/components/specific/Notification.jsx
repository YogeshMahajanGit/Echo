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
import { useErrors } from "../../hooks/Hook";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function Notification() {
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();

  const dispatch = useDispatch();

  async function handleFriendRequest({ _id, accept }) {
    dispatch(setIsNotification(false));

    try {
      const res = await acceptRequest({ requestId: _id, accept });

      if (res.data?.success) {
        console.log("socket");
        toast.success(res.data?.message);
      } else {
        console.log("eoor");
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message);
    }
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
