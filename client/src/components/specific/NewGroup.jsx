import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateNewGroupMutation,
  useGetFriendQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/Hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

function NewGroup() {
  const { isNewGroup } = useSelector((state) => state.misc);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const dispatch = useDispatch();
  const groupName = useInputValidation("");

  // fetch friend
  const { isError, isLoading, error, data } = useGetFriendQuery();

  const [newGroup, groupIsLoading] = useAsyncMutation(
    useCreateNewGroupMutation
  );

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  function handlerSelectMembers(id) {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currEle) => currEle !== id)
        : [...prev, id]
    );
  }

  function handleCreateGroup() {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please select At least 3 members");

    // create a new group
    newGroup("Creating group", {
      name: groupName.value,
      members: selectedMembers,
    });

    handleClodeDialog();
  }
  function handleClodeDialog() {
    dispatch(setIsNewGroup(false));
  }

  return (
    <Dialog open={isNewGroup} onClose={handleClodeDialog}>
      <Stack spacing={2} padding={{ xs: "1rem", sm: "2rem" }} width={"25rem"}>
        <DialogTitle variant="h5" textAlign={"center"}>
          New Group
        </DialogTitle>

        <TextField
          size="small"
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={handlerSelectMembers}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="outlined"
            onClick={handleCreateGroup}
            disabled={groupIsLoading}
          >
            Create
          </Button>
          <Button color="error" variant="text" onClick={handleClodeDialog}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
