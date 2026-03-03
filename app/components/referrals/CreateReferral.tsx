"use client";

import { ReferralCreate } from "../../lib/types";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import React from "react";
import NumberField from "../NumberField";

interface CreateReferralProps {
  onSubmit: (data: ReferralCreate) => void;
  onClose?: () => void;
}

const defaultData: ReferralCreate = {
  referrer_id: 0,
  company: "",
  position: "",
  application_date: "",
  interview_date: "",
  status: "",
  notes: "",
};

const referralKeyMap: Record<string, string> = {
  referrer_id: "Referrer ID",
  company: "Company",
  position: "Position",
  application_date: "Application Date",
  interview_date: "Interview Date",
  status: "Status",
  notes: "Notes",
};

export default function CreateReferral({
  onSubmit,
  onClose,
}: CreateReferralProps) {
  const [formData, setFormData] = React.useState<ReferralCreate>(defaultData);

  const handleChange = (
    key: keyof ReferralCreate,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof ReferralCreate)[] = ["referrer_id"];
    const cleaned = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [
        k,
        !requiredFields.includes(k as keyof ReferralCreate) && v === ""
          ? null
          : v,
      ]),
    ) as ReferralCreate;
    onSubmit(cleaned);
  };

  const renderField = (key: keyof ReferralCreate) => {
    const label = referralKeyMap[key] || key;
    const value = formData[key] ?? "";
    const isIdField = key === "referrer_id";
    const isMultilineField = key === "notes";
    const isDate = key === "application_date" || key === "interview_date";

    let input;
    if (isIdField) {
      input = (
        <NumberField
          label={label}
          value={typeof value === "number" ? value : undefined}
          onValueChange={(val) => handleChange("referrer_id", val)}
        />
      );
    } else if (isDate) {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          type="date"
          value={value}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      );
    } else {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          multiline={isMultilineField}
          minRows={isMultilineField ? 3 : undefined}
        />
      );
    }

    return (
      <Grid key={key} item xs={12} sm={isMultilineField ? 12 : 6}>
        {input}
      </Grid>
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
        }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              New Referral
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track a new referral or job application
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Referrer */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Referrer
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(["referrer_id"] as (keyof ReferralCreate)[]).map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Job Details */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Job Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(
              [
                "company",
                "position",
                "status",
                "application_date",
                "interview_date",
              ] as (keyof ReferralCreate)[]
            ).map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Notes */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Notes
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {(["notes"] as (keyof ReferralCreate)[]).map(renderField)}
          </Grid>

          {/* Actions */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
            {onClose && (
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              Create Referral
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
