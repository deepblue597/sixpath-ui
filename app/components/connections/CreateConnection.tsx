"use client";

import { ConnectionCreate } from "../../lib/types";
import { getUserById } from "../../lib/users";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Stack,
  FormHelperText,
} from "@mui/material";
import React from "react";
import NumberField from "../NumberField";

interface CreateConnectionProps {
  onSubmit: (data: ConnectionCreate) => void;
  onClose?: () => void;
}

const defaultData: ConnectionCreate = {
  person1_id: 0,
  person2_id: 0,
  relationship: "",
  strength: undefined,
  context: "",
  last_interaction: undefined,
  notes: "",
};

const connectionKeyMap: Record<string, string> = {
  person1_id: "Person 1 ID",
  person2_id: "Person 2 ID",
  relationship: "Relationship",
  strength: "Strength",
  last_interaction: "Last Interaction",
  context: "Context",
  notes: "Notes",
};

export default function CreateConnection({
  onSubmit,
  onClose,
}: CreateConnectionProps) {
  const [formData, setFormData] = React.useState<ConnectionCreate>(defaultData);
  const [person1Name, setPerson1Name] = React.useState<string | null>(null);
  const [person2Name, setPerson2Name] = React.useState<string | null>(null);

  // Live name lookup for person1_id
  React.useEffect(() => {
    const id = formData.person1_id;
    if (!id) {
      setPerson1Name(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      getUserById(id)
        .then((user) => {
          if (!cancelled)
            setPerson1Name(`${user.first_name} ${user.last_name}`);
        })
        .catch(() => {
          if (!cancelled) setPerson1Name("User not found");
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.person1_id]);

  // Live name lookup for person2_id
  React.useEffect(() => {
    const id = formData.person2_id;
    if (!id) {
      setPerson2Name(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      getUserById(id)
        .then((user) => {
          if (!cancelled)
            setPerson2Name(`${user.first_name} ${user.last_name}`);
        })
        .catch(() => {
          if (!cancelled) setPerson2Name("User not found");
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.person2_id]);

  const handleChange = (
    key: keyof ConnectionCreate,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof ConnectionCreate)[] = [
      "person1_id",
      "person2_id",
    ];
    const cleaned = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [
        k,
        !requiredFields.includes(k as keyof ConnectionCreate) && v === ""
          ? null
          : v,
      ]),
    ) as ConnectionCreate;
    onSubmit(cleaned);
  };

  const renderField = (key: keyof ConnectionCreate) => {
    const label = connectionKeyMap[key] || key;
    const value = formData[key] ?? "";
    const isIdField = key === "person1_id" || key === "person2_id";
    const isMultilineField = key === "context" || key === "notes";

    let input;
    if (isIdField) {
      const namePrev = key === "person1_id" ? person1Name : person2Name;
      input = (
        <Box>
          <NumberField
            label={label}
            value={typeof value === "number" ? value : undefined}
            onValueChange={(val) =>
              handleChange(key as keyof ConnectionCreate, val ?? undefined)
            }
          />
          {namePrev && (
            <FormHelperText sx={{ ml: 1 }}>{namePrev}</FormHelperText>
          )}
        </Box>
      );
    } else if (key === "strength") {
      input = (
        <NumberField
          min={0}
          max={5}
          label={label}
          value={typeof value === "number" ? value : undefined}
          onValueChange={(val) => handleChange("strength", val ?? undefined)}
        />
      );
    } else if (key === "last_interaction") {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          type="date"
          value={typeof value === "string" ? value : ""}
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
          value={typeof value === "string" ? value : ""}
          onChange={(e) => handleChange(key, e.target.value)}
          multiline={isMultilineField}
          minRows={isMultilineField ? 4 : undefined}
        />
      );
    }

    return (
      <Grid key={key} size={{ xs: 12, sm: isMultilineField ? 12 : 6 }}>
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
              New Connection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Link two people and describe their relationship
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* IDs */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            People
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(["person1_id", "person2_id"] as (keyof ConnectionCreate)[]).map(
              renderField,
            )}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Relationship */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Relationship Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(
              [
                "relationship",
                "strength",
                "last_interaction",
              ] as (keyof ConnectionCreate)[]
            ).map(renderField)}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Context & Notes */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Context &amp; Notes
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {(["context", "notes"] as (keyof ConnectionCreate)[]).map(
              renderField,
            )}
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
              Create Connection
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
