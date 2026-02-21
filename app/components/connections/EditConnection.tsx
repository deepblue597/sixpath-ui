import { ConnectionUpdate } from "../../lib/types";
import {
  Box,
  Grid,
  TextField,
  Tooltip,
  Card,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import React from "react";
import NumberField from "../NumberField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface EditConnectionProps {
  connection: ConnectionUpdate;
  onClose: () => void;
  onUpdate: (updated: ConnectionUpdate) => void;
}

const defaultData: ConnectionUpdate = {
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

export default function EditConnection({
  connection,
  onClose,
  onUpdate,
}: EditConnectionProps) {
  const data = { ...defaultData, ...connection };
  const [formData, setFormData] = React.useState<ConnectionUpdate>(data);

  const handleChange = (
    key: keyof ConnectionUpdate,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  const renderField = (key: keyof ConnectionUpdate) => {
    const label = connectionKeyMap[key] || key;
    const value = formData[key] ?? "";
    const isIdField = key === "person1_id" || key === "person2_id";
    const isMultilineField = key === "context" || key === "notes";
    const isFullWidth = isMultilineField || key === "last_interaction";
    let input;
    if (isIdField) {
      input = (
        <TextField
          fullWidth
          size="small"
          label={label}
          value={String(value)}
          disabled
        />
      );
    } else if (key === "strength") {
      input = (
        <NumberField
          min={0}
          max={5}
          label={label}
          value={typeof value === "number" ? value : undefined}
          onValueChange={(val) => handleChange("strength", val)}
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
          onChange={(e) => handleChange(key, e.target.value)}
        />
      );
    } else {
      input = (
        <TextField
          fullWidth
          multiline
          rows={isMultilineField ? 4 : 2}
          label={label}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      );
    }

    return (
      <Grid key={key} spacing={2}>
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
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Tooltip title="Back to connections">
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography variant="h5" fontWeight={600}>
              Edit Connection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update relationship details and interaction context
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(connectionKeyMap).map((key) =>
            renderField(key as keyof ConnectionUpdate),
          )}
        </Box>

        {/* Actions */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
