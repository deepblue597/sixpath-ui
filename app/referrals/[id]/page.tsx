"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReferralResponse } from "@/app/lib/types";
import { getReferralById } from "@/app/lib/referrals";
import { getUserById } from "@/app/lib/users";
import { Box, CircularProgress, Typography } from "@mui/material";
import ReferralCard from "@/app/components/referrals/ReferralCard";

export default function ReferralPage() {
  const router = useRouter();
  const { id } = useParams();
  const referralId = Number(id);
  const [referral, setReferral] = useState<ReferralResponse | null>(null);
  const [referrerName, setReferrerName] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferralById(referralId)
      .then(async (data) => {
        setReferral(data);
        try {
          const user = await getUserById(data.referrer_id);
          setReferrerName(`${user.first_name} ${user.last_name}`);
        } catch {
          // fallback to showing ID
        }
      })
      .catch((err) => console.error("Failed to fetch referral data:", err))
      .finally(() => setLoading(false));
  }, [referralId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!referral) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load referral data.
        </Typography>
      </Box>
    );
  }

  return (
    <ReferralCard
      referral={referral}
      referrerName={referrerName}
      onEdit={(id) => {
        router.push(`/referrals/${id}/edit`);
      }}
    />
  );
}
