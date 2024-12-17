import { Box, Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Table({ rows, columns, heading, rowHeight = 52 }) {
  return (
    <Container
      sx={{
        height: "100vh",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
        }}
      >
        <Typography
          textAlign={"center"}
          variant="h4"
          sx={{
            margin: "2rem",
          }}
        >
          {heading}
        </Typography>
        {rows.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              color: "GrayText",
              marginTop: "10rem",
            }}
          >
            No Data
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            sx={{
              height: "80%",
              border: "none",
              ".table-header": {
                bgcolor: "black",
                color: "white",
              },
            }}
          ></DataGrid>
        )}
      </Paper>
    </Container>
  );
}

export default Table;
