"use client";

import { ConnectionResponse } from "@/app/models/ResponseModels";
import { Paper } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

interface ContactsTableProps {
  data: ConnectionResponse[];
  onClick?: (row: ConnectionResponse) => void;
}

const connectionKeyMap: { [key: string]: string } = {
  id: "ID",
  person1_id: "Person 1 ID",
  person2_id: "Person 2 ID",
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
  flex: 1,
  minWidth: 150,
  renderCell: (params: GridRenderCellParams) => {
    const value = params.value;
    if (value instanceof Date) {
      return value.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
    }
    return String(value ?? "-");
  },
}));

const pagionationModel = { pageSize: 5, page: 0 };

export default function ContactsTable({ data, onClick }: ContactsTableProps) {
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
      }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel: pagionationModel } }}
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
