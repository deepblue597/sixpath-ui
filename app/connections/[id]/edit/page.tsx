"use client";

import EditConnection from "@/app/components/connections/EditConnection";
import {
  getConnectionById,
  updateConnection,
  get_first_last_name_by_connection_id,
} from "@/app/lib/connections";
import {
  ConnectionNameResponse,
  ConnectionResponse,
  ConnectionUpdate,
} from "@/app/lib/types";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditConnectionPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionResponse | null>(null);
  const [names, setNames] = useState<ConnectionNameResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    Promise.all([
      getConnectionById(id),
      get_first_last_name_by_connection_id(id),
    ])
      .then(([connData, namesData]) => {
        setConnection(connData);
        setNames(namesData);
      })
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
    <Box>
      <EditConnection
        connection={connection}
        names={names}
        onClose={() => {
          router.push(`/connections/${id}`);
          console.log("Closed");
        }}
        onUpdate={(updatedData: Partial<ConnectionUpdate>) => {
          console.log("Updated connection data:", updatedData);
          updateConnection(id, updatedData as ConnectionUpdate)
            .then(() => {
              console.log("Connection updated successfully");
              router.push(`/connections/${id}`);
            })
            .catch((err) => console.error("Failed to update connection:", err));
        }}
      />
    </Box>
  );
}
