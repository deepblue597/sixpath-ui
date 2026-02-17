"use client";
import { Box, Card, Grid, Typography } from "@mui/material";
import RefStats from "@/app/components/referrals/RefStats";
import { useRouter } from "next/navigation";
import RefTable from "../components/referrals/RefTable";
import ReferralData from "../../referralData.js";

export default function ReferralsPage() {
  const router = useRouter();

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
        Referrals
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Manage and explore your referrals
      </Typography>
      <RefStats />
      <RefTable
        data={ReferralData} // Replace with actual referral data
        onClick={(row) => router.push(`/referrals/${row.id}/edit`)}
      />
    </Box>
  );
}
