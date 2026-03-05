"use client";

import { ConnectionResponse } from "../../lib/types";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

export type ConnectionDisplayRow = ConnectionResponse & {
  user1_full_name?: string;
  user2_full_name?: string;
};

interface ContactsTableProps {
  data: ConnectionDisplayRow[];
  onClick?: (row: ConnectionDisplayRow) => void;
}

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB");
}

const relationshipColors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"> = {
  friend: "success",
  colleague: "primary",
  mentor: "secondary",
  client: "info",
  acquaintance: "default",
};

const columns: GridColDef<ConnectionDisplayRow>[] = [
  {
    field: "user1_full_name",
    headerName: "Person 1",
    flex: 1.5,
    minWidth: 160,
    renderCell: ({ row }) => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "primary.main" }}>
          {initials(row.user1_full_name)}
        </Avatar>
        <Typography variant="body2" fontWeight={500}>
          {row.user1_full_name ?? "—"}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "user2_full_name",
    headerName: "Person 2",
    flex: 1.5,
    minWidth: 160,
    renderCell: ({ row }) => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "secondary.main" }}>
          {initials(row.user2_full_name)}
        </Avatar>
        <Typography variant="body2" fontWeight={500}>
          {row.user2_full_name ?? "—"}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "relationship",
    headerName: "Relationship",
    flex: 1,
    minWidth: 130,
    renderCell: ({ value }) => {
      const label = value ?? "—";
      const color = relationshipColors[String(label).toLowerCase()] ?? "default";
      return value ? (
        <Chip label={label} color={color} size="small" variant="outlined" />
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      );
    },
  },
  {
    field: "strength",
    headerName: "Strength",
    flex: 1,
    minWidth: 140,
    renderCell: ({ value }) =>
      value != null ? (
        <Rating value={Number(value)} max={5} readOnly size="small" />
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      ),
  },
  {
    field: "context",
    headerName: "Context",
    flex: 1.5,
    minWidth: 150,
    renderCell: ({ value }) =>
      value ? (
        <Tooltip title={String(value)} placement="top-start">
          <Typography
            variant="body2"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      ),
  },
  {
    field: "last_interaction",
    headerName: "Last Interaction",
    flex: 1,
    minWidth: 140,
    renderCell: ({ value }) => (
      <Typography variant="body2">{formatDate(value)}</Typography>
    ),
  },
  {
    field: "notes",
    headerName: "Notes",
    flex: 2,
    minWidth: 160,
    renderCell: ({ value }) =>
      value ? (
        <Tooltip title={String(value)} placement="top-start">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      ),
  },
];

const paginationModel = { pageSize: 10, page: 0 };

export default function ConnectionsTable({ data, onClick }: ContactsTableProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        height: 520,
        width: "90%",
        borderRadius: 3,
        overflow: "hidden",
        margin: "auto",
      }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 25, 50]}
        rowHeight={56}
        onRowClick={onClick ? ({ row }) => onClick(row) : undefined}
        sx={{
          border: "none",
          "& .MuiDataGrid-row": { cursor: onClick ? "pointer" : "default" },
          "& .MuiDataGrid-row:hover": { bgcolor: "action.hover" },
          "& .MuiDataGrid-columnHeaders": { bgcolor: "grey.50" },
        }}
      />
    </Paper>
  );
}
