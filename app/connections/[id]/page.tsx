"use client";

import ConnectionCard from "@/app/components/connections/ConnectiondCard";
import { deleteConnection, getConnectionById } from "@/app/lib/connections";
import { ConnectionResponse } from "@/app/lib/types";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConnectionPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionResponse | null>(null);

  useEffect(() => {
    getConnectionById(id)
      .then((data) => setConnection(data))
      .catch((err) => console.error("Failed to fetch connection data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!connection) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load connection data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <ConnectionCard
          connection={connection}
          onEdit={(id) => {
            router.push(`/connections/${id}/edit`);
          }}
          onDelete={async (id) => {
            await deleteConnection(id);
            router.push("/connections");
          }}
        />
      </Box>
    </Box>
  );
}
