import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import { ConnectionNameResponse, ConnectionResponse } from "@/app/lib/types";
import { useState } from "react";

interface ConnectionCardProps {
  connection: ConnectionResponse;
  names?: ConnectionNameResponse;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ConnectionCard({
  connection,
  names,
  onEdit,
  onDelete,
}: ConnectionCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(connection.id);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Connection #{connection.id}
              </Typography>
              {connection.relationship && (
                <Chip
                  label={connection.relationship}
                  color="primary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>

            {connection.strength !== null &&
              connection.strength !== undefined && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}>
                    Strength
                  </Typography>
                  <Rating value={connection.strength} readOnly size="small" />
                </Box>
              )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Connection Details */}
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Person 1
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {names?.user1_full_name ?? `ID: ${connection.person1_id}`}
                </Typography>
              </Grid>
              <Grid>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Person 2
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {names?.user2_full_name ?? `ID: ${connection.person2_id}`}
                </Typography>
              </Grid>
            </Grid>

            {connection.context && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium">
                  Context
                </Typography>
                <Typography variant="body1">{connection.context}</Typography>
              </Box>
            )}

            {connection.notes && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium">
                  Notes
                </Typography>
                <Typography variant="body1">{connection.notes}</Typography>
              </Box>
            )}

            {connection.last_interaction && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium">
                  Last Interaction
                </Typography>
                <Typography variant="body1">
                  {formatDate(connection.last_interaction)}
                </Typography>
              </Box>
            )}

            <Divider />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                display="block">
                Created: {formatDate(connection.created_at)}
              </Typography>
              {connection.updated_at && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  display="block">
                  Updated: {formatDate(connection.updated_at)}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(connection.id)}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}>
            Delete
          </Button>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description">
        <DialogTitle
          id="delete-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon color="error" />
          Delete Connection
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this connection? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
