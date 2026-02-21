"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import Graph from "@/app/components/home/Graph";
import NetworkInsights from "@/app/components/home/NetworkInsights";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    Promise.all([getAllUsers(), getAllConnections(), getMe()])
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
        avgStrength={3.5}
        uniqueCompanies={12}
        topSector="Technology"
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
