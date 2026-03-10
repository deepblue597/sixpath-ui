"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getAllConnections, deleteConnection } from "../lib/connections";
import { getAllReferrals, deleteReferral } from "../lib/referrals";
import { getAllUsers, deleteUser } from "../lib/users";

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val == null ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const [connections, referrals, contacts] = await Promise.all([
        getAllConnections(),
        getAllReferrals(),
        getAllUsers(),
      ]);

      if (connections.length > 0) {
        downloadFile(
          toCsv(connections as unknown as Record<string, unknown>[]),
          "connections.csv",
        );
      }
      if (referrals.length > 0) {
        downloadFile(
          toCsv(referrals as unknown as Record<string, unknown>[]),
          "referrals.csv",
        );
      }
      if (contacts.length > 0) {
        downloadFile(
          toCsv(contacts as unknown as Record<string, unknown>[]),
          "contacts.csv",
        );
      }

      const total = connections.length + referrals.length + contacts.length;
      setMessage({
        text:
          total > 0
            ? `Exported ${connections.length} connections, ${referrals.length} referrals, and ${contacts.length} contacts.`
            : "No data to export.",
        type: "success",
      });
    } catch {
      setMessage({ text: "Failed to export data.", type: "error" });
    } finally {
      setExporting(false);
    }
  };

  const handleClearConfirm = async () => {
    setClearDialogOpen(false);
    setClearing(true);
    setMessage(null);
    try {
      const [connections, referrals, contacts] = await Promise.all([
        getAllConnections(),
        getAllReferrals(),
        getAllUsers(),
      ]);

      await Promise.all([
        ...connections.map((c) => deleteConnection(c.id)),
        ...referrals.map((r) => deleteReferral(r.id)),
        ...contacts.map((u) => deleteUser(u.id)),
      ]);

      setMessage({
        text: `Cleared ${connections.length} connections, ${referrals.length} referrals, and ${contacts.length} contacts.`,
        type: "success",
      });
    } catch {
      setMessage({
        text: "Failed to clear all data. Some items may have been deleted.",
        type: "error",
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 800, mx: "auto" }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your data and privacy preferences
        </Typography>
      </Stack>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Data & Privacy
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            {/* Export */}
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                Export your data
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}>
                Download all your connections, referrals, and contacts as CSV
                files.
              </Typography>
              <Button
                variant="outlined"
                startIcon={
                  exporting ? <CircularProgress size={18} /> : <DownloadIcon />
                }
                onClick={handleExport}
                disabled={exporting}>
                {exporting ? "Exporting..." : "Export as CSV"}
              </Button>
            </Box>

            <Divider />

            {/* Clear */}
            <Box>
              <Typography variant="subtitle1" fontWeight={500} color="error">
                Clear all data
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}>
                Permanently delete all your connections, referrals, and
                contacts. This action cannot be undone.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={
                  clearing ? (
                    <CircularProgress size={18} color="error" />
                  ) : (
                    <DeleteForeverIcon />
                  )
                }
                onClick={() => setClearDialogOpen(true)}
                disabled={clearing}>
                {clearing ? "Clearing..." : "Clear all data"}
              </Button>
            </Box>
          </Stack>

          {message && (
            <Typography
              variant="body2"
              sx={{ mt: 3 }}
              color={
                message.type === "success" ? "success.main" : "error.main"
              }>
              {message.text}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear all data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all your connections, referrals, and
            contacts. This action cannot be undone. Consider exporting your data
            first.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={handleClearConfirm}
            color="error"
            variant="contained">
            Delete everything
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
