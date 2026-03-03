"use client";

import CreateConnection from "../../components/connections/CreateConnection";
import { createConnection } from "../../lib/connections";
import { ConnectionCreate } from "../../lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

export default function CreateConnectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ConnectionCreate) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createConnection(data);
      router.push(`/connections/${created.id}`);
    } catch (err) {
      setError("Failed to create connection. Please try again.");
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
      <CreateConnection
        onSubmit={handleSubmit}
        onClose={() => router.push("/connections")}
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
