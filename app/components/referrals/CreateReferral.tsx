"use client";

import { ReferralCreate, UserResponse } from "../../lib/types";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonIcon from "@mui/icons-material/Person";
import NoteIcon from "@mui/icons-material/Note";
import React, { useEffect, useState } from "react";
import { getAllUsersPaginated } from "../../lib/users";

interface CreateReferralProps {
  onSubmit: (data: ReferralCreate) => void;
  onClose?: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending",  label: "Pending" },
  { value: "offered",  label: "Offered" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
];

const defaultData: ReferralCreate = {
  referrer_id: 0,
  company: "",
  position: "",
  application_date: "",
  interview_date: "",
  status: "",
  notes: "",
};

export default function CreateReferral({ onSubmit, onClose }: CreateReferralProps) {
  const [formData, setFormData] = useState<ReferralCreate>(defaultData);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [referrer, setReferrer] = useState<UserResponse | null>(null);

  useEffect(() => {
    getAllUsersPaginated().then(setUsers).catch(() => {});
  }, []);

  const handleChange = (key: keyof ReferralCreate, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof ReferralCreate)[] = ["referrer_id"];
    const cleaned = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [
        k,
        !requiredFields.includes(k as keyof ReferralCreate) && v === "" ? null : v,
      ]),
    ) as ReferralCreate;
    onSubmit(cleaned);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card elevation={4} sx={{ width: "100%", maxWidth: 900, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>New Referral</Typography>
            <Typography variant="body2" color="text.secondary">
              Track a new referral or job application
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Referrer */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Referrer</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={users}
                getOptionKey={(u) => u.id}
                  getOptionLabel={(u) => `${u.first_name} ${u.last_name}`}
                value={referrer}
                onChange={(_, val) => {
                  setReferrer(val);
                  handleChange("referrer_id", val?.id ?? 0);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Referred by" size="small" required />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Job Details */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <WorkOutlineIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Job Details</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Company"
                value={formData.company ?? ""}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Position"
                value={formData.position ?? ""}
                onChange={(e) => handleChange("position", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select fullWidth size="small" label="Status"
                value={formData.status ?? ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Application Date" type="date"
                value={formData.application_date ?? ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleChange("application_date", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Interview Date" type="date"
                value={formData.interview_date ?? ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleChange("interview_date", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Notes */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <NoteIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth size="small" label="Notes" multiline minRows={3}
                value={formData.notes ?? ""}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            {onClose && <Button variant="outlined" onClick={onClose}>Cancel</Button>}
            <Button type="submit" variant="contained" disabled={!formData.referrer_id}>
              Create Referral
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
