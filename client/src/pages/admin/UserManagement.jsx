import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Skeleton } from "@mui/material";
import { transformImage } from "../../lib/features";
import { useErrors } from "../../hooks/Hook";
import { useGetAdminUsersQuery } from "../../redux/api/api";
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
    renderCell: (params) => (
      <Avatar
        alt={params.row.name}
        src={params.row.avatar}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

function UserManagement() {
  const [rows, setRows] = useState([]);
  const { data, isLoading, error } = useGetAdminUsersQuery();

  useErrors([{ isError: error, error: error }]);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
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
          heading={"All Users"}
          columns={columns}
        />
      )}
    </AdminLayout>
  );
}

export default UserManagement;
