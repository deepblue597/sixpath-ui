"use client";

import { Box, Card, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HubIcon from "@mui/icons-material/Hub";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";

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
  uniqueSectors: number;
}

export default function NetworkInsights({
  totalContacts,
  totalConnections,
  avgStrength,
  topSector,
  uniqueCompanies,
  uniqueSectors,
}: NetworkInsightsProps) {
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

      <StatCard
        icon={<BusinessIcon fontSize="small" />}
        label="Unique Sector"
        value={uniqueSectors}
        color="info"
      />
    </Box>
  );
}
