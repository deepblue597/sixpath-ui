"use client";

import { useRouter } from "next/navigation";
import UpdateContact from "../../../components/contacts/UpdateContact";

export default function EditContactPage() {
  const router = useRouter();
  return (
    <UpdateContact
      initialData={{
        first_name: "John",
        last_name: "Doe",
        company: "Acme Corp",
        sector: "Technology",
        email: "",
        phone: "",
        linkedin_url: "",
        how_i_know_them: "Met at a conference",
        when_i_met_them: "2022-05-15",
      }}
      onSubmit={(data) => {
        console.log("Updated contact data:", data);
        // Here you would typically send the updated data to your backend API
      }}
      onClose={() => {
        router.push("/contacts");
        console.log("Closed");
      }}
    />
  );
}
