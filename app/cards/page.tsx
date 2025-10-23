"use client";

import { useEffect, useState, useCallback } from "react";
import { getCards, createCard, updateCard, deleteCard } from "./actions";
import { getCategories } from "../categories/actions";
import { Card as CardType } from "@/types";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function CardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [editId, setEditId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  const loadCards = useCallback(async () => {
    const data = await getCards(categoryId);
    setCards(data);
  }, [categoryId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function handleCreate() {
    if (!question.trim() || !answer.trim() || categoryId == null) return;
    await createCard({ question, answer, category_id: categoryId });
    setQuestion("");
    setAnswer("");
    await loadCards();
  }

  function handleStartEdit(card: CardType) {
    setEditId(card.id);
    setQuestion(card.question);
    setAnswer(card.answer);
    setIsDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (editId == null) return;
    await updateCard(editId, {
      question,
      answer,
      category_id: categoryId ?? 0,
    });
    setEditId(null);
    setQuestion("");
    setAnswer("");
    setIsDialogOpen(false);
    await loadCards();
  }

  async function handleDelete(id: number) {
    await deleteCard(id);
    await loadCards();
  }

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "& input": { color: "white" },
    },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiSelect-icon": { color: "white" },
    "& .MuiSelect-select": { color: "white" },
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-center">Cards</h1>

      <FormControl fullWidth size="small" sx={inputStyles}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          label="Category"
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Create new card */}
      <div className="flex flex-col gap-2">
        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          size="small"
          sx={inputStyles}
        />
        <TextField
          label="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          fullWidth
          size="small"
          sx={inputStyles}
        />
        <div className="flex gap-2">
          <Button variant="contained" onClick={handleCreate}>
            Add Card
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setQuestion("");
              setAnswer("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Cards list */}
      <List>
        {cards.map((c) => (
          <ListItem
            key={c.id}
            sx={{
              border: "1px solid white",
              borderRadius: 2,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={c.question}
              secondary={c.answer}
              primaryTypographyProps={{ sx: { color: "white" } }}
              secondaryTypographyProps={{ sx: { color: "white" } }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={() => handleStartEdit(c)}>
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton onClick={() => handleDelete(c.id)}>
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Edit dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit card</DialogTitle>
        <DialogContent className="flex flex-col gap-2">
          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            size="small"
            sx={inputStyles}
          />
          <TextField
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            fullWidth
            size="small"
            sx={inputStyles}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "white", color: "black" }}
            onClick={handleSaveEdit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
