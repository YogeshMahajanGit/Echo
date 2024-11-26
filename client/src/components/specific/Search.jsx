import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
// import { userInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { sampleUsers } from "../constants/sampleData";

function Search() {
  const [users, setUsers] = useState(sampleUsers);
  // const searchValue = userInputValidation("");

  let isLoadingSendfriendRequest = false;

  function handlerAddFriend(id) {
    console.log(id);
  }

  return (
    <Dialog open>
      <Stack
        padding={"2rem"}
        direction={"column"}
        width={"24rem"}
        sx={{
          borderRadius: "2rem",
        }}
      >
        <DialogTitle variant="h5" textAlign={"center"}>
          Find People
        </DialogTitle>
        <TextField
          label=""
          // value={searchValue.value}
          // onChange={searchValue.changeHandler}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handler={handlerAddFriend}
              handlerIsLoading={isLoadingSendfriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
}

export default Search;
