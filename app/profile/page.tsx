"use client";

import ProfileCard from "../components/profile/ProfileCard";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UserResponse } from "../lib/types";
import { getMe } from "../lib/users";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load user data.
        </Typography>
      </Box>
    );
  }

  return (
    <ProfileCard
      user={user}
      onClick={(userData) => {
        console.log(userData);
      }}
      onEdit={() => router.push("/profile/edit")}
    />
  );
}
