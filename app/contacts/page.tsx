"use client";

import PeopleList from "../components/contacts/PeopleList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserResponse } from "../lib/types";
import { getAllUsers } from "../lib/users";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ContactsPage() {
  const router = useRouter();
  const [people, setPeople] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all contacts — client-side search & pagination handles the rest
    getAllUsers({ limit: 1000 })
      .then((users) => setPeople(users))
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 3,
        }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            Contacts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and manage people in your network
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/contacts/create")}>
          New Contact
        </Button>
      </Box>
      <PeopleList
        people={people}
        onClick={(person) => router.push(`/contacts/${person.id}`)}
      />
    </Box>
  );
}
