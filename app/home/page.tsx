"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import Graph from "@/app/components/home/Graph";
import NetworkInsights from "@/app/components/home/NetworkInsights";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConnectionResponse, UserResponse } from "../lib/types";
import { getAllUsers, getMe } from "../lib/users";
import { getAllConnections } from "../lib/connections";
export default function HomePage() {
  const router = useRouter();
  const [peopleData, setPeopleData] = useState<UserResponse[]>([]);
  const [connectionData, setConnectionData] = useState<ConnectionResponse[]>(
    [],
  );
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const totalContacts = peopleData.length;
  const totalConnections = connectionData.length;

  const avgStrength = useMemo(() => {
    const withStrength = connectionData.filter((c) => c.strength != null);
    if (!withStrength.length) return 0;
    const sum = withStrength.reduce((acc, c) => acc + (c.strength ?? 0), 0);
    return parseFloat((sum / withStrength.length).toFixed(1));
  }, [connectionData]);

  const uniqueCompanies = useMemo(
    () => new Set(peopleData.map((p) => p.company).filter(Boolean)).size,
    [peopleData],
  );

  const topSector = useMemo(() => {
    const counts: Record<string, number> = {};
    peopleData.forEach((p) => {
      if (p.sector) counts[p.sector] = (counts[p.sector] ?? 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : "N/A";
  }, [peopleData]);

  useEffect(() => {
    Promise.all([getAllUsers({ limit: 1000 }), getAllConnections(), getMe()])
      .then(([users, connections, me]) => {
        setPeopleData(users);
        setConnectionData(connections);
        setCurrentUser(me);
      })
      .catch((err) => console.error("Failed to fetch data:", err))
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
      sx={{ p: 3, height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={600}>
          SixPath
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualize and manage your professional connections
        </Typography>
      </Box>

      {/* Network Insights */}
      <NetworkInsights
        totalConnections={totalConnections}
        totalContacts={totalContacts}
        avgStrength={avgStrength}
        uniqueCompanies={uniqueCompanies}
        topSector={topSector}
      />

      {/* Graph Container */}
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",

          // flexGrow: 1,
          // minHeight: 0,
          // borderRadius: 3,
          // boxShadow: 3,
          // overflow: "hidden",
          // backgroundColor: "background.paper",
        }}>
        <Graph
          peopleData={peopleData}
          connectionData={connectionData}
          currentUser={currentUser}
          onEdgeClick={() => {
            console.log("edge Clicked");
          }}
          onNodeClick={() => {
            console.log("node Clicked");
          }}
        />
      </Box>
    </Box>
  );
}
