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
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "../lib/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await requestPasswordReset(username);
      if (token) {
        router.push(`/reset-password?token=${encodeURIComponent(token)}`);
      } else {
        // Username not found — generic message to prevent enumeration
        setError("If that username exists, a reset link has been generated.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}>
          Enter your username and a reset link will be generated.
        </Typography>

        <Stack
          component="form"
          spacing={2}
          sx={{ width: "100%" }}
          onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            size="small"
          />

          {error && <Alert severity="info">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !username}
            sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reset Link"}
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
      </Card>
    </Box>
  );
}
