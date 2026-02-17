"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import PersonIcon from "@mui/icons-material/Person";

export default function ConnectionStats() {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Total Connections */}
      <Grid>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,

            alignItems: "center",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HubIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Total Connections
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700}>
            245
          </Typography>
        </Card>
      </Grid>

      {/* User Connections */}
      <Grid>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon color="secondary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Your Connections
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700}>
            87
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
