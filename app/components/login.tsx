import React, { useState } from "react";
import { Box, Button, TextField, Card, Typography } from "@mui/material";

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
      }}>
      <Typography variant="h3" gutterBottom>
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
          label="Name"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          label="Password"
          type="password"
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default Login;
