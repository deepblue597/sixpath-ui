"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactsIcon from "@mui/icons-material/Contacts";
import GroupIcon from "@mui/icons-material/Group";
import HeaderBar from "./header";

interface DrawerItem {
  text: string;
  icon: React.ElementType;
  href: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const drawerList: DrawerItem[] = [
    { text: "Home", icon: HomeIcon, href: "/" },
    { text: "Profile", icon: AccountCircleIcon, href: "/profile" },
    { text: "Contacts", icon: ContactsIcon, href: "/contacts" },
    { text: "Connections", icon: GroupIcon, href: "/connections" },
    { text: "References", icon: InboxIcon, href: "/references" },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {drawerList.map(({ text, icon: Icon, href }) => {
          const isSelected = pathname === href;
          return (
            <ListItem key={text} disablePadding>
              <Link
                href={href}
                passHref
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}>
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.16)",
                      },
                    },
                  }}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box>
      <HeaderBar onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
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

      {children}
    </Box>
  );
}
