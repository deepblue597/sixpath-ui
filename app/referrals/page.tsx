"use client";
import { Box, Card, CircularProgress, Grid, Typography } from "@mui/material";
import RefStats from "@/app/components/referrals/RefStats";
import { useRouter } from "next/navigation";
import RefTable from "../components/referrals/RefTable";
import { useEffect, useState } from "react";
import { ReferralResponse } from "../lib/types";
import { getAllReferrals } from "../lib/referrals";

export default function ReferralsPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<ReferralResponse[]>([]); // Replace with actual referral data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReferrals()
      .then((data) => setReferrals(data))
      .catch((err) => console.error("Failed to fetch referrals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalReferrals = referrals.length;
  const totalReferrers = new Set(referrals.map((ref) => ref.referrer_id)).size;

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
      <RefStats
        totalReferrals={totalReferrals}
        totalReferrers={totalReferrers}
      />
      <RefTable
        data={referrals} // Replace with actual referral data
        onClick={(row) => router.push(`/referrals/${row.id}/edit`)}
      />
    </Box>
  );
}
