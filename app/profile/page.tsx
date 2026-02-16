"use client";

import ProfileCard from "../components/profile/ProfileCard";

export default function ProfilePage() {
  const userData = {
    id: 1,
    username: "johndoe",
    is_me: true,
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
    created_at: new Date("2020-01-01"),
  };
  return (
    <ProfileCard
      user={userData}
      onClick={(userData) => {
        console.log(userData);
      }}
    />
  );
}
