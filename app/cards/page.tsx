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

  const [editCardId, setEditCardId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>(
    undefined
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    setEditCardId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setEditCategoryId(card.category_id);
    setIsEditDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (
      editCardId == null ||
      !editQuestion.trim() ||
      !editAnswer.trim() ||
      editCategoryId == null
    ) {
      alert("Please select a category before saving.");
      return;
    }

    await updateCard(editCardId, {
      question: editQuestion,
      answer: editAnswer,
      category_id: editCategoryId,
    });

    setEditCardId(null);
    setEditQuestion("");
    setEditAnswer("");
    setEditCategoryId(undefined);
    setIsEditDialogOpen(false);
    await loadCards();
  }

  async function handleDelete(id: number) {
    await deleteCard(id);
    await loadCards();
  }

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: "white",
      },
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiSelect-icon": {
      color: "rgba(255, 255, 255, 0.7)",
    },
  };

  const listItemStyles = {
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    mb: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
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
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            Add Card
          </Button>
        </div>
      </div>

      {/* Cards list */}
      <List>
        {cards.map((c) => (
          <ListItem key={c.id} sx={listItemStyles}>
            <ListItemText
              primary={c.question}
              secondary={c.answer}
              primaryTypographyProps={{
                sx: {
                  color: "white",
                  fontWeight: "medium",
                  fontSize: "1rem",
                },
              }}
              secondaryTypographyProps={{
                sx: {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.875rem",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handleStartEdit(c)}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(c.id)}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Edit dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle sx={{ color: "black" }}>Edit card</DialogTitle>
        <DialogContent className="flex flex-col gap-2">
          <TextField
            label="Question"
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputLabel-root": { color: "black" },
            }}
          />
          <TextField
            label="Answer"
            value={editAnswer}
            onChange={(e) => setEditAnswer(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputLabel-root": { color: "black" },
            }}
          />
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={editCategoryId ?? ""}
              onChange={(e) => setEditCategoryId(Number(e.target.value))}
              label="Category"
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ color: "black" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={handleSaveEdit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
