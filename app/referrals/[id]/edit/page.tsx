"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import EditReferral from "@/app/components/referrals/EditReferral";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteReferral,
  getReferralById,
  updateReferral,
} from "@/app/lib/referrals";
import { error } from "console";
import { ReferralResponse, ReferralUpdate } from "@/app/lib/types";

export default function EditReferralPage() {
  const router = useRouter();
  const { id } = useParams();
  const referralId = Number(id);
  const [referral, setReferral] = useState<ReferralResponse | null>(null); // Replace with actual referral data fetching
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReferralById(referralId)
      .then((data) => setReferral(data))
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
    <Box>
      <EditReferral
        referral={referral}
        onClose={() => {
          router.push("/referrals");
          console.log("Closed");
        }}
        onUpdate={(updatedData: Partial<ReferralUpdate>) => {
          updateReferral(referralId, updatedData as ReferralUpdate)
            .then(() => {
              console.log("Referral updated successfully");
              router.push("/referrals");
            })
            .catch((err) => console.error("Failed to update referral:", err));
        }}
        onDelete={() => {
          deleteReferral(referralId)
            .then(() => {
              console.log("Referral deleted successfully");
              router.push("/referrals");
            })
            .catch((err) => console.error("Failed to delete referral:", err));
        }}
      />
    </Box>
  );
}
