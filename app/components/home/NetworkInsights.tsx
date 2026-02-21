"use client";

import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HubIcon from "@mui/icons-material/Hub";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";
import PersonData from "@/personsData";
import connectionData from "@/connectionData";
import { useMemo } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  subtitle?: string;
}

function StatCard({
  icon,
  label,
  value,
  color = "primary",
  subtitle,
}: StatCardProps) {
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 160,
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        <Typography variant="body2" color="text.secondary" fontSize={13}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} color="text.primary">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Card>
  );
}

interface NetworkInsightsProps {
  totalContacts: number;
  totalConnections: number;
  avgStrength: number;
  topSector: string;
  uniqueCompanies: number;
}

export default function NetworkInsights({
  totalContacts,
  totalConnections,
  avgStrength,
  topSector,
  uniqueCompanies,
}: NetworkInsightsProps) {
  // const insights = useMemo(() => {
  //   // Total contacts
  //   const totalContacts = PersonData.length;

  //   // Total connections
  //   const totalConnections = connectionData.length;

  //   // Average connection strength
  //   const avgStrength =
  //     connectionData.reduce((sum, conn) => sum + conn.strength, 0) /
  //     connectionData.length;

  //   // Top sector
  //   const sectorCounts: Record<string, number> = {};
  //   PersonData.forEach((person) => {
  //     sectorCounts[person.sector] = (sectorCounts[person.sector] || 0) + 1;
  //   });
  //   const topSector = Object.entries(sectorCounts).sort(
  //     (a, b) => b[1] - a[1],
  //   )[0];

  //   // Number of companies
  //   const uniqueCompanies = new Set(PersonData.map((p) => p.company)).size;

  //   return {
  //     totalContacts,
  //     totalConnections,
  //     avgStrength: avgStrength.toFixed(1),
  //     topSector: topSector ? `${topSector[0]} (${topSector[1]})` : "N/A",
  //     uniqueCompanies,
  //   };
  // }, []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "center",
        mb: 3,
      }}>
      <StatCard
        icon={<PersonIcon fontSize="small" />}
        label="Total Contacts"
        value={totalContacts}
        color="primary"
      />
      <StatCard
        icon={<HubIcon fontSize="small" />}
        label="Connections"
        value={totalConnections}
        color="secondary"
        subtitle="links between contacts"
      />

      <StatCard
        label="Unique Companies"
        value={uniqueCompanies}
        icon={<BusinessIcon fontSize="small" />}
        color="warning"
        subtitle="different organizations"
      />
      <StatCard
        icon={<TrendingUpIcon fontSize="small" />}
        label="Avg. Strength"
        value={avgStrength}
        color="success"
        subtitle="out of 5"
      />
      <StatCard
        icon={<BusinessIcon fontSize="small" />}
        label="Top Sector"
        value={topSector}
        color="info"
      />
    </Box>
  );
}
