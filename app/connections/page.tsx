"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ConnectionsTable, {
  ConnectionDisplayRow,
} from "../components/connections/ConnnectionsTable";
import ConnectionStats from "../components/connections/ConnectionStats";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAllConnections,
  get_first_last_name_by_connection_id,
} from "../lib/connections";
import { getMe } from "../lib/users";
import AddIcon from "@mui/icons-material/Add";
export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<ConnectionDisplayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [myConnectionCount, setMyConnectionCount] = useState(0);

  const totalConnections = connections.length;

  useEffect(() => {
    Promise.all([getAllConnections(), getMe()])
      .then(async ([data, me]) => {
        const enriched = await Promise.all(
          data.map(async (conn) => {
            try {
              const names = await get_first_last_name_by_connection_id(conn.id);
              return { ...conn, ...names };
            } catch {
              return conn;
            }
          }),
        );
        setConnections(enriched);
        const myCount = enriched.filter(
          (c) => c.person1_id === me.id || c.person2_id === me.id,
        ).length;
        setMyConnectionCount(myCount);
      })
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            Connections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and explore your professional network
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/connections/create")}>
          New Connection
        </Button>
      </Box>
      <ConnectionStats
        totalConnections={totalConnections}
        myConnections={myConnectionCount}
      />
      <ConnectionsTable
        data={connections}
        onClick={(row) => router.push(`/connections/${row.id}`)}
      />
    </Box>
  );
}
