import { ReferralUpdate } from "../../lib/types";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React from "react";
import NumberField from "../NumberField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

interface EditReferralProps {
  referral: ReferralUpdate;
  onClose: () => void;
  onUpdate: (updated: ReferralUpdate) => void;
  onDelete?: () => void;
}

const defaultData: ReferralUpdate = {
  referrer_id: undefined,
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

export default function EditReferral({
  referral,
  onClose,
  onUpdate,
  onDelete,
}: EditReferralProps) {
  const data = { ...defaultData, ...referral };
  const [formData, setFormData] = React.useState<ReferralUpdate>(data);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleChange = (
    key: keyof ReferralUpdate,
    value: string | number | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete?.();
    onClose();
  };

  const renderField = (key: keyof ReferralUpdate) => {
    const label = referralKeyMap[key] || key;
    const value = formData[key] ?? "";
    const isIdField = key === "referrer_id";
    const isMultilineField = key === "notes";

    const isDate = key === "application_date" || key === "interview_date";

    let input;
    if (isIdField) {
      input = (
        <NumberField
          size="small"
          label={label}
          value={value as number | undefined}
          disabled
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
          {Object.keys(referralKeyMap).map((key) =>
            renderField(key as keyof ReferralUpdate),
          )}
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mt: 4,
          }}>
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}>
              Delete
            </Button>
          )}
          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description">
          <DialogTitle id="delete-dialog-title">Delete Referral?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this referral? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} autoFocus>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
}
