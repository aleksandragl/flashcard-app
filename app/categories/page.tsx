"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    await createCategory(name);
    setName("");
    await loadCategories();
  }

  async function handleStartEdit(category: Category) {
    setEditId(category.id);
    setEditName(category.name);
    setIsDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (editId == null || !editName.trim()) return;
    await updateCategory(editId, editName);
    setEditId(null);
    setEditName("");
    setIsDialogOpen(false);
    await loadCategories();
  }

  async function handleDelete(id: number) {
    await deleteCategory(id);
    await loadCategories();
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-center">Categories</h1>

      <div className="flex gap-2">
        <TextField
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiInputBase-input": { color: "black" },
            "& .MuiInputLabel-root": { color: "black" },
          }}
        />
        <Button variant="contained" onClick={handleCreate}>
          Add
        </Button>
      </div>
      <List>
        {categories.map((c) => (
          <ListItem
            key={c.id}
            secondaryAction={
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => handleStartEdit(c)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </div>
            }
          >
            <ListItemText primary={c.name} />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
