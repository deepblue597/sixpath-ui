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
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactsIcon from "@mui/icons-material/Contacts";
import GroupIcon from "@mui/icons-material/Group";
import PeopleList from "./components/personCard";
import PersonData from "../personsData";
import connectionData from "../connectionData";
import ReferralData from "../referralData";
interface DrawerItem {
  text: string;
  icon: React.ElementType;
  onClick?: () => void;
}

export default function Home() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const drawerList: DrawerItem[] = [
    { text: "Home", icon: HomeIcon },
    { text: "Profile", icon: AccountCircleIcon },
    { text: "Contacts", icon: ContactsIcon },
    { text: "Connections", icon: GroupIcon },
    { text: "References", icon: InboxIcon },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {drawerList.map(({ text, icon: Icon }) => (
          <ListItem
            onClick={() => {
              console.log(text);
            }}
            key={text}
            disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon />
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%", // important!
          }}>
          <Box sx={{ flexGrow: 1 }}>{DrawerList}</Box>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              SixPath 1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
      {/* <TravelCard
        travelData={TravelCardData}
        onClick={(card) => {
          console.log("Clicked on:", card);
          // Handle navigation or any other action
        }}
      /> */}

      {/* <PeopleList people={PersonData} /> */}
      <Table
        data={ReferralData}
        onClick={(row) => {
          console.log(row);
        }}
      />
    </Box>
  );
}
