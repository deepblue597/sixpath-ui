"use client";

import { UserCreate } from "../../lib/types";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";

interface CreateContactProps {
  onSubmit: (data: UserCreate) => void;
  onClose?: () => void;
}

const contactKeyMap: Record<string, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  company: "Company",
  sector: "Sector",
  email: "Email",
  phone: "Phone",
  linkedin_url: "LinkedIn URL",
  how_i_know_them: "How I Know Them",
  when_i_met_them: "When I Met Them",
  notes: "Notes",
};

const fieldGroups = {
  basic: ["first_name", "last_name"],
  professional: ["company", "sector"],
  contact: ["email", "phone", "linkedin_url"],
  communication: ["how_i_know_them", "when_i_met_them", "notes"],
};

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

export default function CreateContact({
  onSubmit,
  onClose,
}: CreateContactProps) {
  const [form, setForm] = useState<UserCreate>(defaultData);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderField = (key: string) => {
    const label = contactKeyMap[key] || key;
    const value = (form[key as keyof UserCreate] as string) ?? "";
    const isMultiline = key === "how_i_know_them" || key === "notes";
    const isDateField = key === "when_i_met_them";

    const input = isDateField ? (
      <TextField
        fullWidth
        size="small"
        label={label}
        type="date"
        value={value}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleInputChange(key, e.target.value)}
      />
    ) : (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        onChange={(e) => handleInputChange(key, e.target.value)}
        multiline={isMultiline}
        minRows={isMultiline ? 3 : undefined}
        required={key === "first_name" || key === "last_name"}
      />
    );

    return (
      <Grid key={key} item xs={12} sm={6}>
        {input}
      </Grid>
    );
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
      <Card
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
        }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
            New Contact
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new person to your network
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* BASIC INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fieldGroups.basic.map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* PROFESSIONAL INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Professional
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fieldGroups.professional.map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* CONTACT INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fieldGroups.contact.map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* COMMUNICATION CONTEXT */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Communication Context
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {fieldGroups.communication.map(renderField)}
          </Grid>

          {/* ACTIONS */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            {onClose && (
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              Create Contact
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
