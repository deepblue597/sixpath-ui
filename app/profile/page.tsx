"use client";

import Form from "../components/form";

export default function ProfilePage() {
  return (
    <Form
      mode="update"
      initialData={{
        first_name: "John",
        last_name: "Doe",
        company: "Acme Corp",
        sector: "Technology",
        email: "sd@gmail.com",
        phone: "123-456-7890",
        linkedin_url: "https://linkedin.com/in/johndoe",
        how_i_know_them: "Met at a conference",
        when_i_met_them: "2022-01-15",
        notes: "Great contact for future collaborations.",
      }}
      onSubmit={(data) => {
        console.log("Form submitted with data:", data);
      }}
    />
  );
}
