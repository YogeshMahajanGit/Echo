import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { useAsyncMutation, useErrors } from "../../hooks/Hook";
import {
  useAddGroupMemberMutation,
  useGetFriendQuery,
} from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

function AddMemberDialog({ chatId }) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();

  const { data, isError, error, isLoading } = useGetFriendQuery(chatId);
  const { isAddMember } = useSelector((state) => state.misc);
  const [addMember, addMemberIsLoading] = useAsyncMutation(
    useAddGroupMemberMutation
  );

  //handle error
  useErrors([{ isError, error }]);

  function handlerSelectMembers(id) {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currEle) => currEle !== id)
        : [...prev, id]
    );
  }

  function handleAddMemberSubmit() {
    addMember("Adding Members...", { members: selectedMembers, chatId });
    handleCloseDialog();
  }

  function handleCloseDialog() {
    dispatch(setIsAddMember(false));
  }

  return (
    <Dialog open={isAddMember} onClose={handleCloseDialog}>
      <Stack p={"2rem"} width={"20rem"} spacing={2}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={2}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={handlerSelectMembers}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Typography
              color="warning"
              p={"0.5rem"}
              variant="h5"
              textAlign={"center"}
            >
              No Friends
            </Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button
            variant="contained"
            disable={addMemberIsLoading}
            onClick={handleAddMemberSubmit}
          >
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default AddMemberDialog;
