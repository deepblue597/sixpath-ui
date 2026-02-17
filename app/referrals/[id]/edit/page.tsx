"use client";

import { Box } from "@mui/material";
import EditReferral from "@/app/components/referrals/EditReferral";
import { useRouter } from "next/navigation";

export default function EditReferralPage() {
  const router = useRouter();
  return (
    <Box>
      <EditReferral
        referral={{
          referrer_id: 1,
          company: "Tech Corp",
          position: "Software Engineer",
          application_date: new Date().toISOString().split("T")[0],
          interview_date: new Date().toISOString().split("T")[0],
          status: "Applied",
          notes: "Referred by John Doe",
        }}
        onClose={() => {
          router.push("/referrals");
          console.log("Closed");
        }}
        onUpdate={(updated) => {
          router.push("/referrals");
          console.log("Updated referral:", updated);
        }}
        onDelete={() => {
          router.push("/referrals");
          console.log("Deleted referral");
        }}
      />
    </Box>
  );
}
