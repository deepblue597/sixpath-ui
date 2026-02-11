"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Login from "./components/login";
import "bootstrap/dist/css/bootstrap.css";
import Table from "./components/table";
import Register from "./components/register";
import Form from "./components/form";
import HeaderBar from "./components/header";
import TravelCard from "./components/card";
import TravelCardData from "../data";
import React from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function Home() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
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
      {/* <Register /> */}

      {/* <Login /> */}
      {/* <Table /> */}
      {/* <Form
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
      /> */}
      <HeaderBar onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <TravelCard
        travelData={TravelCardData}
        onClick={(card) => {
          console.log("Clicked on:", card);
          // Handle navigation or any other action
        }}
      />
    </Box>
  );
}
