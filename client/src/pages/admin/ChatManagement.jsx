import { Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { useGetAdminChatsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/Hook";
import LoadingGrid from "../../components/shared/LoadingGrid";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard
        max={100}
        avatar={params.row.members}
      />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "created",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack
        direction={"row"}
        alignContent={"center"}
        spacing={1}
      >
        <AvatarCard src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

function ChatManagement() {
  const [rows, setRows] = useState([]);
  const { data, isLoading, error } = useGetAdminChatsQuery();

  useErrors([{ isError: error, error: error }]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((chat) => ({
          ...chat,
          id: chat._id,
          avatar: chat.avatar.map((i) => transformImage(i, 50)),
          members: chat.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: chat.creator.name,
            avatar: transformImage(chat.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <Table
          rows={rows}
          heading={"All Chats"}
          columns={columns}
        />
      )}
    </AdminLayout>
  );
}

export default ChatManagement;
