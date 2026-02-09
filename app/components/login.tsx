import React, { useState } from "react";
import { Box, Button, TextField, Card, Typography } from "@mui/material";
import Image from "next/image";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState<{
    name: string;
    password: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted({ name, password });
  };

  return (
    <Card
      sx={{
        padding: 4,
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}>
      <Image src="/logo1.png" alt="SixPath Logo" width={200} height={100} />

      <Typography variant="h3" gutterBottom color="primary">
        Welcome to SixPath
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 13,
          gap: 15,
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          label="Username"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          label="Password"
          type="password"
        />
        <Box
          style={{
            marginTop: 20,
            gap: 50,
            display: "flex",
          }}>
          <Button type="submit" variant="contained" color="secondary">
            Login
          </Button>
          <Button variant="text" color="primary">
            Sign Up
          </Button>
        </Box>
      </form>
      {submitted && (
        <Box mt={2}>
          <Typography variant="h6">Submitted Data:</Typography>
          <Typography>Name: {submitted.name}</Typography>
          <Typography>Password: {submitted.password}</Typography>
        </Box>
      )}
    </Card>
  );
}

export default Login;
