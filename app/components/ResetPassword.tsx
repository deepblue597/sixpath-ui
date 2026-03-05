"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../lib/auth";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef7ff 0%, #ffffff 100%)",
        px: 2,
      }}>
      <Card
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          boxShadow: 6,
          width: { xs: "100%", sm: 400 },
        }}>
        <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}>
          Enter your new password below.
        </Typography>

        {success ? (
          <Alert severity="success" sx={{ width: "100%" }}>
            Password reset successfully. Redirecting to login...
          </Alert>
        ) : (
          <Stack
            component="form"
            spacing={2}
            sx={{ width: "100%" }}
            onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
              autoComplete="new-password"
              size="small"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              size="small"
            />

            {error && <Alert severity="error">{error}</Alert>}

            {!token && (
              <Alert severity="warning">
                No reset token found. Please go back and request a new link.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !token || !newPassword || !confirm}
              sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Set New Password"}
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              color="inherit"
              size="small"
              sx={{ alignSelf: "center", color: "text.secondary" }}>
              Back to Login
            </Button>
          </Stack>
        )}
      </Card>
    </Box>
  );
}
