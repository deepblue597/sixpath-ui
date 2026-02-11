import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { TextField, Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { Ref, useState } from "react";
import { ReferralResponse, ConnectionResponse } from "../models/ResponseModels";
import { AlignHorizontalCenter } from "@mui/icons-material";

interface TableProps {
  data: ReferralResponse[] | ConnectionResponse[];
  // type?: "referral" | "connection";
  onClick?: (row: ReferralResponse | ConnectionResponse) => void;
}

export default function Table({ data, onClick }: TableProps) {
  // Get all unique keys from the data array
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item))),
  );
  const columns: GridColDef[] = allKeys.map((key) => ({
    field: key,
    headerName: key.replace(/_/g, " ").toUpperCase(),
    flex: 2,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Typography
        // variant="body2"
        sx={{
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}>
        {params.value instanceof Date
          ? params.value.toLocaleDateString()
          : String(params.value ?? "-")}
      </Typography>
    ),
  }));

  const paginationModel = { pageSize: 5, page: 0 };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        height: 500,
        width: "90%",
        borderRadius: 3,
        overflow: "hidden",
        margin: "auto",
        marginTop: 4,
        alignContent: "center",
      }}>
      {/* <TextField
        label="Search"
        variant="outlined"
        size="small"
        // value={searchText}
        // onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      /> */}
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "primary", // header background
            color: "primary", // header text
            // color: "primary.contrastText", // header text
            // fontWeight: "bold",
            fontFamily: "sans-serif",
          },
        }}
        // sx={{
        //   border: 0,
        //   backgroundColor: "background.paper",

        //   "& .MuiDataGrid-columnHeaders": {
        //     backgroundColor: "primary.main",
        //     color: "primary.contrastText", // keep
        //     fontWeight: "bold",
        //     borderBottom: "1px solid",
        //   },

        //   "& .MuiDataGrid-columnHeaderTitle": {
        //     color: "primary.contrastText", // 👈 force the header title color
        //   },

        //   "& .MuiDataGrid-row:hover": {
        //     backgroundColor: "secondary.light",
        //   },

        //   "& .MuiDataGrid-cell": {
        //     borderBottom: "1px solid",
        //     borderColor: "divider",
        //   },
        // }}
        onRowClick={
          onClick
            ? (params) => {
                onClick(params.row);
              }
            : undefined
        }
      />
    </Paper>
  );
}
