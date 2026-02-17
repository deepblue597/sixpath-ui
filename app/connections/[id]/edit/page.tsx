"use client";

import EditConnection from "@/app/components/connections/EditConnection";
import { Box, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";

export default function EditConnectionPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Edit Connection #{id}
      </Typography>
      <EditConnection
        connection={{
          person1_id: 1,
          person2_id: 3,
          relationship: "Friend",
          strength: 5,
          context: "Met at university",
          last_interaction: new Date().toISOString().split("T")[0],
          notes: "Best friend from college",
        }}
        onClose={() => {
          router.push("/connections");
          console.log("Closed");
        }}
        onUpdate={(updated) => {
          console.log("Updated connection:", updated);
        }}
      />
    </Box>
  );
}
