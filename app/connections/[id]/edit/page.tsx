"use client";

import EditConnection from "@/app/components/connections/EditConnection";
import { useRouter } from "next/navigation";

export default function EditConnectionPage() {
  const router = useRouter();
  return (
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
  );
}
