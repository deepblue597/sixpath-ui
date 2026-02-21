import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { UserResponse, UserUpdate } from "../../lib/types";
import { Yaldevi } from "next/font/google";
import { Button, Chip, Divider, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import BusinessIcon from "@mui/icons-material/Business";
import HubIcon from "@mui/icons-material/Hub";
import ContactsIcon from "@mui/icons-material/Contacts";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "next/link";

interface ProfileCardProps {
  user: UserResponse;
  onClick?: (user: UserResponse) => void;
  onEdit?: () => void;
}

export default function ProfileCard({
  user,
  onClick,
  onEdit,
}: ProfileCardProps) {
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
            onClick={onEdit}>
            <EditIcon />
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
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginLeft: 2 }}>
              username: {user.username}
            </Typography>
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
      </Card>
    </Box>
  );
}
