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

interface UpdateInfoProps {
  initialData: Partial<UserUpdate>;
  onSubmit: (data: Partial<UserUpdate>) => void;
}

const toLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const fieldGroups = {
  basic: ["first_name", "last_name", "username", "password"],
  professional: ["company", "sector"],
  contact: ["email", "phone", "linkedin_url"],
};

// Outside the component to avoid re-creation on every render
const requiredFields = [
  "first_name",
  "last_name",
  "username",
  "password",
  "email",
];

const defaultData = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  company: "",
  sector: "",
  email: "",
  phone: "",
  linkedin_url: "",
};

export default function UpdateInfo({ initialData, onSubmit }: UpdateInfoProps) {
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

  const renderFields = (fields: string[]) =>
    fields.map((key) => (
      <Grid key={key} item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          required={requiredFields.includes(key)}
          label={toLabel(key)}
          type={
            key === "password" ? "password" : key === "email" ? "email" : "text"
          }
          value={form[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
      </Grid>
    ));

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
        <Tooltip title="Back to Profile" arrow>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => router.push("/profile")}>
            <Person2Icon />
          </IconButton>
        </Tooltip>

        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {renderFields(fieldGroups.basic)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* PROFESSIONAL INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Professional
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {renderFields(fieldGroups.professional)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* CONTACT INFO */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            {renderFields(fieldGroups.contact)}
          </Grid>

          {/* ACTIONS */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button variant="contained" size="large" type="submit">
              Save Changes
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
