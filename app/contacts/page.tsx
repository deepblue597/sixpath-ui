"use client";

import PersonCard from "../components/contacts/personCard";
import PersonData from "../../personsData.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserResponse } from "../lib/types";
import { getAllUsers } from "../lib/users";
import { Box, CircularProgress } from "@mui/material";

export default function ContactsPage() {
  const router = useRouter();
  const [people, setPeople] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
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
    <PersonCard
      people={people}
      onClick={(person) => router.push(`/contacts/${person.id}/edit`)}
    />
  );
}
