/* eslint-disable no-unused-vars */
import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useState } from "react";

function NewGroup() {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const groupName = useInputValidation("");

  function handlerSelectMembers(id) {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currEle) => currEle !== id)
        : [...prev, id]
    );
  }

  function handleCreate() {}
  function handleClodeDialog() {}

  return (
    <Dialog open onClose={handleClodeDialog}>
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
          {members.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handler={handlerSelectMembers}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
          <Button color="error" variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
