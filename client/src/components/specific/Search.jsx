import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/Hook";

function Search() {
  const { isSearch } = useSelector((state) => state.misc);
  const [users, setUsers] = useState([]);
  const searchValue = useInputValidation("");
  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendfriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  // search for users
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(searchValue.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.error(e));
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchValue.value, searchUser]);

  // function for send request
  async function handlerAddFriend(id) {
    await sendFriendRequest("Sending friend request...", { userId: id });
  }
  const handleSearchClose = () => dispatch(setIsSearch(false));

  return (
    <Dialog
      open={isSearch}
      onClose={handleSearchClose}
    >
      <Stack
        padding={"2rem"}
        direction={"column"}
        width={"24rem"}
        sx={{
          borderRadius: "2rem",
        }}
      >
        <DialogTitle
          variant="h5"
          textAlign={"center"}
        >
          Find People
        </DialogTitle>
        <TextField
          label=""
          value={searchValue.value}
          onChange={searchValue.changeHandler}
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
