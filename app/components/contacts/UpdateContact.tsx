"use client";

import { UserUpdate } from "@/app/models/InputModels";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";

interface UpdateInfoProps {
  initialData: Partial<UserUpdate>;
  onSubmit: (data: Partial<UserUpdate>) => void;
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

// Outside the component to avoid re-creation on every render
const requiredFields = ["first_name", "last_name", "email"];

const defaultData = {
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

export default function UpdateContact({
  initialData,
  onSubmit,
  onClose,
}: UpdateInfoProps) {
  const router = useRouter();

  const [form, setForm] = useState(() => ({
    ...defaultData,
    ...initialData,
  }));

  const handleInputChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const rednderField = (key: string) => {
    const label = contactKeyMap[key] || key;
    const value = form[key as keyof UserUpdate] ?? "";
    const isMultiline = key === "how_i_know_them" || key === "notes";
    const isDateField = key === "when_i_met_them";
    let input;

    if (isDateField) {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          type="date"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
      );
    } else {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
          multiline={isMultiline}
          minRows={isMultiline ? 3 : undefined}
        />
      );
    }
    return (
      <Grid key={key} item xs={12} sm={6}>
        {input}
      </Grid>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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
          position: "relative",
        }}>
        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fieldGroups.basic.map(rednderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* PROFESSIONAL INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Professional
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {fieldGroups.professional.map(rednderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* CONTACT INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            {fieldGroups.contact.map(rednderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* COMMUNICATION CONTEXT */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Communication Context
          </Typography>
          <Grid container spacing={2}>
            {fieldGroups.communication.map(rednderField)}
          </Grid>

          {/* ACTIONS */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
