import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Box,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import { ReferralResponse } from "../../lib/types";

interface ReferralCardProps {
  referral: ReferralResponse;
  onEdit?: (id: number) => void;
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReferralCard({ referral, onEdit }: ReferralCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 2,
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 2,
      }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Referral #{referral.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Referrer ID: {referral.referrer_id}
            </Typography>
          </Box>
          {referral.status && (
            <Chip
              label={referral.status}
              size="small"
              color={
                referral.status === "Applied"
                  ? "primary"
                  : referral.status === "Interview Scheduled"
                    ? "warning"
                    : referral.status === "Rejected"
                      ? "error"
                      : "default"
              }
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Main Info */}
        <Stack spacing={1.5}>
          {referral.company && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Company
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {referral.company}
                </Typography>
              </Box>
            </Box>
          )}
          {referral.position && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WorkIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Position
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {referral.position}
                </Typography>
              </Box>
            </Box>
          )}
          {(referral.application_date || referral.interview_date) && (
            <Box sx={{ display: "flex", gap: 3 }}>
              {referral.application_date && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EventIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Applied
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(referral.application_date)}
                    </Typography>
                  </Box>
                </Box>
              )}
              {referral.interview_date && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EventIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Interview
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(referral.interview_date)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {referral.notes && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Notes
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ mt: 0.25 }}>
                {referral.notes}
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mt: 2, mb: 1 }} />

        {/* Timestamps */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(referral.created_at)}
          </Typography>
          {referral.updated_at && (
            <Typography variant="caption" color="text.secondary">
              Updated: {formatDate(referral.updated_at)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      {onEdit && (
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(referral.id)}>
            Edit
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
