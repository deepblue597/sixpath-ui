"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import ContactsTable from "../components/connections/ConnnectionsTable";
import ConnectionStats from "../components/connections/ConnectionStats";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllConnections } from "../lib/connections";
import { ConnectionResponse } from "../lib/types";
export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<ConnectionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const totalConnections = connections.length;
  //const myConnections = connections.filter((conn) => conn.is_mutual).length;

  useEffect(() => {
    getAllConnections()
      .then((data) => setConnections(data))
      .catch((err) => console.error("Failed to fetch connections:", err))
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
    <Box
      sx={{
        padding: 3,
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="h4" fontWeight={700}>
        Connections
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Manage and explore your professional network
      </Typography>
      <ConnectionStats totalConnections={totalConnections} myConnections={22} />
      <ContactsTable
        data={connections}
        onClick={(row) => router.push(`/connections/${row.id}/edit`)}
      />
    </Box>
  );
}
