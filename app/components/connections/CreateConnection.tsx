"use client";

import { ConnectionCreate, UserResponse } from "../../lib/types";
import { getAllUsersPaginated } from "../../lib/users";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HubIcon from "@mui/icons-material/Hub";
import NoteIcon from "@mui/icons-material/Note";
import React, { useEffect, useState } from "react";

interface CreateConnectionProps {
  onSubmit: (data: ConnectionCreate) => void;
  onClose?: () => void;
}

const RELATIONSHIP_OPTIONS = [
  "Colleague", "Friend", "Mentor", "Mentee", "Client",
  "Manager", "Acquaintance", "Partner", "Other",
];

const defaultData: ConnectionCreate = {
  person1_id: 0,
  person2_id: 0,
  relationship: "",
  strength: undefined,
  context: "",
  last_interaction: undefined,
  notes: "",
};

export default function CreateConnection({ onSubmit, onClose }: CreateConnectionProps) {
  const [formData, setFormData] = useState<ConnectionCreate>(defaultData);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [person1, setPerson1] = useState<UserResponse | null>(null);
  const [person2, setPerson2] = useState<UserResponse | null>(null);

  useEffect(() => {
    getAllUsersPaginated().then(setUsers).catch(() => {});
  }, []);

  const handleChange = (key: keyof ConnectionCreate, value: string | number | undefined | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof ConnectionCreate)[] = ["person1_id", "person2_id"];
    const cleaned = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [
        k,
        !requiredFields.includes(k as keyof ConnectionCreate) && v === "" ? null : v,
      ]),
    ) as ConnectionCreate;
    onSubmit(cleaned);
  };

  const canSubmit = formData.person1_id && formData.person2_id &&
    formData.person1_id !== formData.person2_id;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card elevation={4} sx={{ width: "100%", maxWidth: 900, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>New Connection</Typography>
            <Typography variant="body2" color="text.secondary">
              Link two people and describe their relationship
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* People */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <PeopleAltIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">People</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={users.filter((u) => u.id !== person2?.id)}
                getOptionKey={(u) => u.id}
                getOptionLabel={(u) => `${u.first_name} ${u.last_name}`}
                value={person1}
                onChange={(_, val) => {
                  setPerson1(val);
                  handleChange("person1_id", val?.id ?? 0);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Person 1" size="small" required />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={users.filter((u) => u.id !== person1?.id)}
                getOptionKey={(u) => u.id}
                getOptionLabel={(u) => `${u.first_name} ${u.last_name}`}
                value={person2}
                onChange={(_, val) => {
                  setPerson2(val);
                  handleChange("person2_id", val?.id ?? 0);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Person 2" size="small" required />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Relationship Details */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <HubIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Relationship Details</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select fullWidth size="small" label="Relationship"
                value={formData.relationship ?? ""}
                onChange={(e) => handleChange("relationship", e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt.toLowerCase()}>{opt}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Last Interaction" type="date"
                value={typeof formData.last_interaction === "string" ? formData.last_interaction : ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleChange("last_interaction", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Connection Strength
                </Typography>
                <Rating
                  value={formData.strength ?? 0}
                  onChange={(_, val) => handleChange("strength", val ?? undefined)}
                  size="large"
                />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Context & Notes */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <NoteIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Context &amp; Notes</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth size="small" label="Context" multiline minRows={3}
                value={typeof formData.context === "string" ? formData.context : ""}
                onChange={(e) => handleChange("context", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth size="small" label="Notes" multiline minRows={3}
                value={typeof formData.notes === "string" ? formData.notes : ""}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            {onClose && <Button variant="outlined" onClick={onClose}>Cancel</Button>}
            <Button type="submit" variant="contained" disabled={!canSubmit}>
              Create Connection
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
