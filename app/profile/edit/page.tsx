"use client";

import UpdateInfo from "@/app/components/profile/UpdateInfo";
import { UserResponse } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateUser } from "@/app/lib/users";
import { UserUpdate } from "@/app/lib/types";
import { Box, CircularProgress } from "@mui/material";

export default function ProfileEdit() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
      })
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
    return <div>Failed to load user data.</div>;
  }

  return (
    <UpdateInfo
      initialData={user}
      onSubmit={(data: Partial<UserUpdate>) => {
        updateUser(user.id, data as UserUpdate)
          .then(() => router.push("/profile"))
          .catch((err) => console.error("Failed to update user:", err));
      }}
      onClose={() => router.push("/profile")}
    />
  );
}

// What happens now:

// User edits the form and clicks "Save Changes"
// onSubmit fires with the updated form data
// updateUser(user.id, data) calls PUT /users/{user_id} with the payload
// On success → redirects back to /profile
// On error → logs to console
// Note: user.id comes from the UserResponse
// state, which is why keeping state as
// UserResponse (not UserUpdate) was important — UserUpdate doesn't have id.
