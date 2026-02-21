"use client";

import { useRouter, useParams } from "next/navigation";
import UpdateContact from "../../../components/contacts/UpdateContact";
import { useEffect, useState } from "react";
import { UserResponse, UserUpdate } from "@/app/lib/types";
import { getUserById, updateUser } from "@/app/lib/users";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function EditContactPage() {
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
    <UpdateContact
      initialData={user}
      onSubmit={(updatedData: Partial<UserUpdate>) => {
        updateUser(contactId, updatedData as UserUpdate)
          .then(() => {
            console.log("Contact updated successfully");
            router.push("/contacts");
          })
          .catch((err) => console.error("Failed to update contact:", err));
      }}
      onClose={() => {
        router.push("/contacts");
        console.log("Closed");
      }}
    />
  );
}
