"use client";

import { useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import Login from "./components/login";
import "bootstrap/dist/css/bootstrap.css";
import Table from "./components/table";
import Register from "./components/register";
import Form from "./components/form";

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
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        height: "100vh",
      }}>
      {/* <Register /> */}

      {/* <Login /> */}
      {/* <Table /> */}
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
    </Box>
  );
}
