"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  Typography,
  Stack,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../lib/auth";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(name, password);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        {/* Logo */}
        <Image src="/logo1.png" alt="SixPaths Logo" width={160} height={80} />

        {/* Heading */}
        <Typography variant="h4" color="primary" sx={{ mt: 2, mb: 1 }}>
          Welcome to SixPaths
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}>
          Visualize and manage your professional network
        </Typography>

        {/* Form */}
        <Stack
          component="form"
          spacing={2}
          sx={{ width: "100%" }}
          onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="username"
            size="small"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            size="small"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Link href="/register">
            <MuiLink underline="none" sx={{ width: "100%" }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ py: 1.5 }}>
                Sign Up
              </Button>
            </MuiLink>
          </Link>
        </Stack>

        {/* Optional Footer */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
          &copy; {new Date().getFullYear()} SixPaths. All rights reserved.
        </Typography>
      </Card>
    </Box>
  );
}
