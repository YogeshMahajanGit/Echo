import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar } from "@mui/material";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    widht: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    widht: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    widht: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    widht: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    widht: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    widht: 200,
  },
];

function UserManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.users.map((user) => ({
        ...user,
        id: user._id,
        avatar: transformImage(user.avatar, 50),
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table rows={rows} heading={"All Users"} columns={columns} />
    </AdminLayout>
  );
}

export default UserManagement;
