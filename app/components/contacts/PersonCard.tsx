import { UserResponse } from "@/app/lib/types";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import HubIcon from "@mui/icons-material/Hub";
import ContactsIcon from "@mui/icons-material/Contacts";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoteIcon from "@mui/icons-material/Note";
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";

interface PersonCardProps {
  user: UserResponse;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PersonCard({
  user,
  onEdit,
  onDelete,
}: PersonCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 5,
      }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          width: "100%",
          maxWidth: 800,
          //   position: "relative",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 2,
            width: "100%",
            position: "relative",
          }}>
          <Button
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => onEdit(user.id)}>
            <EditIcon />
          </Button>
          <Button
            color="error"
            sx={{ position: "absolute", top: 8, right: 56 }}
            onClick={() => setConfirmOpen(true)}>
            <DeleteIcon />
          </Button>
          <AccountCircle
            color="primary"
            sx={{ fontSize: 80, marginBottom: 2 }}
          />
          <Box
            sx={{
              marginLeft: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 1,
            }}>
            <Typography variant="h3" component="div" sx={{ marginLeft: 2 }}>
              {user.first_name} {user.last_name}
            </Typography>
            {/* <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginLeft: 2 }}>
              username: {user.username}
            </Typography> */}
          </Box>
        </Box>
        <Divider sx={{ width: "100%", marginY: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            gap: 1,
          }}>
          {" "}
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<BusinessIcon />}
              label={"Industry • " + user.sector}
              variant="outlined"
              color="primary"
            />
            <Chip
              icon={<HubIcon />}
              label={"Company • " + user.company}
              variant="outlined"
              color="secondary"
            />
            <Chip
              icon={<ContactsIcon />}
              label="Connections • 42"
              variant="outlined"
              color="default"
            />
          </Stack>
        </Box>
        <Divider sx={{ width: "100%", marginY: 2 }} />
        <Box
          sx={{
            width: "100%",

            p: 2,
          }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Information
          </Typography>

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Email
              </Typography>
              <Link href={`mailto:${user.email}`} underline="hover">
                {user.email}
              </Link>
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1.5} alignItems="center">
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Phone
              </Typography>
              <Typography variant="body2">{user.phone}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1.5} alignItems="center">
              <LinkedInIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                LinkedIn
              </Typography>
              {user.linkedin_url ? (
                <Link
                  href={user.linkedin_url}
                  underline="hover"
                  target="_blank">
                  {user.linkedin_url.replace("https://", "")}
                </Link>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not provided
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Communication Context */}
        {(user.how_i_know_them || user.when_i_met_them || user.notes) && (
          <>
            <Divider sx={{ width: "100%", marginY: 2 }} />
            <Box sx={{ width: "100%", p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Communication Context
              </Typography>
              <Stack spacing={1.5}>
                {user.how_i_know_them && (
                  <>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start">
                      <PeopleAltIcon
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.3 }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          How I Know Them
                        </Typography>
                        <Typography variant="body1">
                          {user.how_i_know_them}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                  </>
                )}
                {user.when_i_met_them && (
                  <>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start">
                      <CalendarTodayIcon
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.3 }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          When I Met Them
                        </Typography>
                        <Typography variant="body1">
                          {user.when_i_met_them}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                  </>
                )}
                {user.notes && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <NoteIcon
                      fontSize="small"
                      color="action"
                      sx={{ mt: 0.3 }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">{user.notes}</Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete contact?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              onDelete(user.id);
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
