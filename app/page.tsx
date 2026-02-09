"use client";

import { useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import Login from "./components/login";
import "bootstrap/dist/css/bootstrap.css";
import Table from "./components/table";
export default function Home() {
  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [submitted, setSubmitted] = useState<{
  //   name: string;
  //   password: string;
  // } | null>(null);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted({ name, password });
  // };

  return (
    <Box
    // sx={{
    //   alignItems: "center",
    //   justifyContent: "center",
    //   display: "flex",
    //   height: "100vh",
    // }}
    >
      <Login />
      <Table />
    </Box>
  );
}
