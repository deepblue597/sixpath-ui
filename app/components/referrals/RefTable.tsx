"use client";

import { ReferralResponse } from "@/app/lib/types";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

export type ReferralDisplayRow = ReferralResponse & {
  referrer_name?: string;
};

interface ReferralTableProps {
  data: ReferralDisplayRow[];
  onClick?: (row: ReferralDisplayRow) => void;
}

type StatusColor = "default" | "primary" | "warning" | "success" | "error" | "info";

const statusConfig: Record<string, { label: string; color: StatusColor }> = {
  applied:    { label: "Applied",    color: "primary" },
  interview:  { label: "Interview",  color: "warning" },
  offer:      { label: "Offer",      color: "success" },
  rejected:   { label: "Rejected",   color: "error"   },
  pending:    { label: "Pending",    color: "default" },
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB");
}

const columns: GridColDef<ReferralDisplayRow>[] = [
  {
    field: "referrer_name",
    headerName: "Referrer",
    flex: 1.2,
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant="body2" fontWeight={500}>
        {value ?? "—"}
      </Typography>
    ),
  },
  {
    field: "company",
    headerName: "Role",
    flex: 2,
    minWidth: 200,
    renderCell: ({ row }) => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
        <Box sx={{ color: "primary.main", display: "flex", alignItems: "center" }}>
          <WorkOutlineIcon fontSize="small" />
        </Box>
        <Stack spacing={0}>
          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
            {row.position ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.company ?? "—"}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: ({ value }) => {
      const key = String(value ?? "").toLowerCase();
      const cfg = statusConfig[key];
      return cfg ? (
        <Chip label={cfg.label} color={cfg.color} size="small" />
      ) : value ? (
        <Chip label={String(value)} size="small" />
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      );
    },
  },
  {
    field: "application_date",
    headerName: "Applied",
    flex: 1,
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant="body2">{formatDate(value)}</Typography>
    ),
  },
  {
    field: "interview_date",
    headerName: "Interview",
    flex: 1,
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant="body2" color={value ? "text.primary" : "text.disabled"}>
        {formatDate(value)}
      </Typography>
    ),
  },
  {
    field: "notes",
    headerName: "Notes",
    flex: 2,
    minWidth: 180,
    renderCell: ({ value }) =>
      value ? (
        <Tooltip title={String(value)} placement="top-start">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2" color="text.disabled">—</Typography>
      ),
  },
];

const paginationModel = { pageSize: 10, page: 0 };

const statusOptions = Object.keys(statusConfig);

export default function RefTable({ data, onClick }: ReferralTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!statusFilter) return data;
    return data.filter(
      (row) => row.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data, statusFilter]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "90%",
        borderRadius: 3,
        overflow: "hidden",
        margin: "auto",
      }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((key) => (
              <MenuItem key={key} value={key}>
                <Chip
                  label={statusConfig[key].label}
                  color={statusConfig[key].color}
                  size="small"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <DataGrid
        rows={filteredData}
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
