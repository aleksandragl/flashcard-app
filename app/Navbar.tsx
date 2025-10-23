"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

type NavbarProps = {
  currentView: "categories" | "cards" | "play" | "stats";
  onChangeView: (view: "categories" | "cards" | "play" | "stats") => void;
};

const pages: {
  label: string;
  view: "categories" | "cards" | "play" | "stats";
}[] = [
  { label: "Categories", view: "categories" },
  { label: "Cards", view: "cards" },
  { label: "Play", view: "play" },
  { label: "Stats", view: "stats" },
];

export default function Navbar({ currentView, onChangeView }: NavbarProps) {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "monospace", letterSpacing: ".1rem" }}
          >
            Flashcard App
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {pages.map((p) => (
              <Button
                key={p.view}
                onClick={() => onChangeView(p.view)}
                variant="outlined"
                sx={{
                  color: "black",
                  borderColor: "black",
                  backgroundColor:
                    currentView === p.view ? "rgba(0,0,0,0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      currentView === p.view
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(0,0,0,0.05)",
                  },
                }}
              >
                {p.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
