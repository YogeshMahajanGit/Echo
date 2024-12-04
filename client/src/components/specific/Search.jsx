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
import toast from "react-hot-toast";

function Search() {
  const [users, setUsers] = useState([]);
  const searchValue = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const dispatch = useDispatch();
  let isLoadingSendfriendRequest = false;

  // search for users
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(searchValue.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.error(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchValue.value, searchUser]);

  // function for send request
  async function handlerAddFriend(id) {
    try {
      const res = await sendFriendRequest({ userId: id });
      if (res.data) {
        toast.success("Request sent successfully");
        console.log(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Request failed");
      }
    } catch (error) {
      toast.error("Something went wrong", error.message);
    }
  }
  const handleSearchClose = () => dispatch(setIsSearch(false));

  return (
    <Dialog open={isSearch} onClose={handleSearchClose}>
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
