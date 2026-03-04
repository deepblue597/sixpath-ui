"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserResponse } from "@/app/lib/types";
import { getUserById, deleteUser } from "@/app/lib/users";
import { Box, CircularProgress, Typography } from "@mui/material";
import PersonCard from "@/app/components/contacts/PersonCard";

export default function ContactPage() {
  const router = useRouter();
  const { id } = useParams();
  const contactId = Number(id);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(contactId)
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch contact data:", err))
      .finally(() => setLoading(false));
  }, [contactId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load contact data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <PersonCard
        user={user}
        onEdit={(id) => {
          router.push(`/contacts/${id}/edit`);
        }}
        onDelete={async (id) => {
          await deleteUser(id);
          router.push("/contacts");
        }}
      />
    </Box>
  );
}
