"use client";

import { ReferralResponse } from "@/app/lib/types";
import { Paper, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

interface ReferralTableProps {
  data: ReferralResponse[];
  onClick?: (row: ReferralResponse) => void;
}

const ReferralKeyMap: { [key: string]: string } = {
  id: "ID",
  referrer_id: "Referrer ID",
  company: "Company",
  position: "Position",
  application_date: "Application Date",
  interview_date: "Interview Date",
  status: "Status",
  notes: "Notes",
  created_at: "Created At",
  updated_at: "Updated At",
};

const columns: GridColDef[] = Object.keys(ReferralKeyMap).map((key) => ({
  field: key,
  headerName: ReferralKeyMap[key],

  flex: 2,
  minWidth: 150,
  renderCell: (params: GridRenderCellParams) => {
    return (
      <Typography variant="body1">
        {params.value instanceof Date
          ? params.value.toLocaleDateString("en-GB") // Format as DD/MM/YYYY
          : String(params.value ?? "-")}
      </Typography>
    );
  },
}));

const pagionationModel = { pageSize: 5, page: 0 };

export default function ContactsTable({ data, onClick }: ReferralTableProps) {
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
      }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel: pagionationModel } }}
        getRowHeight={() => "auto"}
        onRowClick={
          onClick
            ? (data) => {
                onClick(data.row);
              }
            : undefined
        }
      />
    </Paper>
  );
}
