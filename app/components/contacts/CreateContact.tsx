"use client";

import { UserCreate } from "../../lib/types";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import NoteIcon from "@mui/icons-material/Note";
import { useEffect, useState } from "react";
import { getUserFilterOptions } from "../../lib/users";

interface CreateContactProps {
  onSubmit: (data: UserCreate) => void;
  onClose?: () => void;
}

const defaultData: UserCreate = {
  first_name: "",
  last_name: "",
  company: "",
  sector: "",
  email: "",
  phone: "",
  linkedin_url: "",
  how_i_know_them: "",
  when_i_met_them: "",
  notes: "",
};

export default function CreateContact({ onSubmit, onClose }: CreateContactProps) {
  const [form, setForm] = useState<UserCreate>(defaultData);
  const [companies, setCompanies] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);

  useEffect(() => {
    getUserFilterOptions()
      .then(({ company, sector }) => {
        setCompanies(company);
        setSectors(sector);
      })
      .catch(() => {});
  }, []);

  const set = (field: keyof UserCreate, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof UserCreate)[] = ["first_name", "last_name"];
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [
        k,
        !requiredFields.includes(k as keyof UserCreate) && v === "" ? null : v,
      ]),
    ) as UserCreate;
    onSubmit(cleaned);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Card elevation={4} sx={{ width: "100%", maxWidth: 900, p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>New Contact</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new person to your network
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Basic */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Basic Information</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="First Name" required
                value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Last Name" required
                value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Professional */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Professional</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={companies}
                value={form.company ?? ""}
                onInputChange={(_, val) => set("company", val)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Company" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={sectors}
                value={form.sector ?? ""}
                onInputChange={(_, val) => set("sector", val)}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Sector / Industry" />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Contact */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <ContactsIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Contact Information</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Email" type="email"
                value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="Phone"
                value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth size="small" label="LinkedIn URL"
                value={form.linkedin_url ?? ""} onChange={(e) => set("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/..." />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Context */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <NoteIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.secondary">Communication Context</Typography>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="How I Know Them" multiline minRows={3}
                value={form.how_i_know_them ?? ""} onChange={(e) => set("how_i_know_them", e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth size="small" label="When I Met Them" type="date"
                value={form.when_i_met_them ?? ""} InputLabelProps={{ shrink: true }}
                onChange={(e) => set("when_i_met_them", e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth size="small" label="Notes" multiline minRows={3}
                value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            {onClose && <Button variant="outlined" onClick={onClose}>Cancel</Button>}
            <Button type="submit" variant="contained">Create Contact</Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
