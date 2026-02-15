"use client";
import { useState } from "react";
import { AccountCreate } from "../models/InputModels";
import {
  Box,
  Button,
  Card,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Item from "@mui/material/Grid";

function Register() {
  const router = useRouter();
  const [form, setForm] = useState<AccountCreate>({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    company: "",
    sector: "",
    email: "",
    phone: "",
    linkedin_url: "",
    // how_i_know_them: "",
    // when_i_met_them: "",
    // notes: "",
    is_me: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to API
    console.log("Form submitted:", form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Get field names directly from the form object
  const fieldNames = Object.keys(form).filter(
    (field) => field !== "is_me",
  ) as Array<keyof AccountCreate>;
  // Split fields for two columns
  const mid = Math.ceil(fieldNames.length / 2);
  const leftFields = fieldNames.slice(0, mid);
  const rightFields = fieldNames.slice(mid);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Card
        elevation={8}
        sx={{
          padding: 4,
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography variant="h3" gutterBottom color="primary">
          Create a new account
        </Typography>
        <form
          style={{
            padding: 13,
            gap: 15,
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid>
              {leftFields.map((fieldName) => (
                <Item key={fieldName}>
                  <TextField
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldName
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    type={
                      fieldName === "password"
                        ? "password"
                        : fieldName === "email"
                          ? "email"
                          : "text"
                    }
                    value={form[fieldName] ?? ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Item>
              ))}
            </Grid>
            <Grid>
              {rightFields.map((fieldName) => (
                <Item key={fieldName}>
                  <TextField
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldName
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    type={
                      fieldName === "password"
                        ? "password"
                        : fieldName === "email"
                          ? "email"
                          : "text"
                    }
                    value={form[fieldName] ?? ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Item>
              ))}
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="secondary">
            Register
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => router.push("/")}>
            Already have an account? Log in
          </Button>
        </form>
        {/* {form && ( // Display submitted data for testing
        <div style={{ marginTop: 20 }}>
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </div>
      )} */}
      </Card>
    </Box>
  );
}

export default Register;
