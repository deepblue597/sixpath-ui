import { Box, Typography } from "@mui/material";
import Graph from "@/app/components/home/Graph";
import NetworkInsights from "@/app/components/home/NetworkInsights";

export default function HomePage() {
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
      <NetworkInsights />

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
        <Graph />
      </Box>
    </Box>
  );
}
