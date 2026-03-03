"use client";

import { ConnectionResponse } from "../../lib/types";
import { Paper, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

export type ConnectionDisplayRow = ConnectionResponse & {
  user1_full_name?: string;
  user2_full_name?: string;
};

interface ContactsTableProps {
  data: ConnectionDisplayRow[];
  onClick?: (row: ConnectionDisplayRow) => void;
}

const connectionKeyMap: { [key: string]: string } = {
  id: "ID",
  user1_full_name: "Person 1",
  user2_full_name: "Person 2",
  relationship: "Relationship",
  strength: "Strength",
  context: "Context",
  last_interaction: "Last Interaction",
  notes: "Notes",
  created_at: "Created At",
  updated_at: "Updated At",
};

const columns: GridColDef[] = Object.keys(connectionKeyMap).map((key) => ({
  field: key,
  headerName: connectionKeyMap[key],

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

const pagionationModel = { pageSize: 10, page: 0 };

export default function ConnectionsTable({
  data,
  onClick,
}: ContactsTableProps) {
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
        pageSizeOptions={[10, 25, 50]}
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
