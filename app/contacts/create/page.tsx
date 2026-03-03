"use client";

import CreateContact from "../../components/contacts/CreateContact";
import { createUser } from "../../lib/users";
import { UserCreate } from "../../lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

export default function CreateContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UserCreate) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createUser(data);
      router.push(`/contacts/${created.id}`);
    } catch (err) {
      setError("Failed to create contact. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CreateContact
        onSubmit={handleSubmit}
        onClose={() => router.push("/contacts")}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
