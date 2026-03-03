"use client";

import CreateReferral from "../../components/referrals/CreateReferral";
import { createReferral } from "../../lib/referrals";
import { ReferralCreate } from "../../lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

export default function CreateReferralPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ReferralCreate) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createReferral(data);
      router.push(`/referrals/${created.id}`);
    } catch (err) {
      setError("Failed to create referral. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CreateReferral
        onSubmit={handleSubmit}
        onClose={() => router.push("/referrals")}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
