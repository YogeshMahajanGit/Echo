import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../components/constants/sampleData";
import { Avatar, Box, Stack } from "@mui/material";
import { fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import ReanderAttachment from "../../components/shared/RenderAttachment";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.lenght > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box key={i}>
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                >
                  {ReanderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "Sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

function MessageManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.message.map((msg) => ({
        ...msg,
        id: msg._id,
        sender: {
          name: msg.sender.name,
          avatar: transformImage(msg.sender.avatar, 50),
        },
        createdAt: moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      <Table
        heading={"All Messages"}
        columns={columns}
        rows={rows}
        rowHeight={180}
      />
    </AdminLayout>
  );
}

export default MessageManagement;
