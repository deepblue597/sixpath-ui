"use client";

import { Box, Typography } from "@mui/material";
import ContactsTable from "../components/connections/ConnnectionsTable";
import ConnectionStats from "../components/connections/ConnectionStats";
import connectionData from "../../connectionData.js";
export default function ConnectionsPage() {
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
      <ConnectionStats />
      <ContactsTable
        data={connectionData}
        onClick={(row) => console.log("Clicked row:", row)}
      />
    </Box>
  );
}
