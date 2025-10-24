"use client";

import { useEffect, useMemo, useState } from "react";
import { getCards } from "./actions";
import { Card as CardType } from "@/types";
import {
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { addStat } from "../stats/actions";

function CircularProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={5}
        sx={{ color: "white" }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" sx={{ color: "white" }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PlayMode({ categoryId }: { categoryId?: number }) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [mode, setMode] = useState<"order" | "random">("order");
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [lastResult, setLastResult] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getCards(categoryId);
      setCards(data);
      setIndex(0);
      setScore({ correct: 0, wrong: 0 });
    }
    load();
  }, [categoryId]);

  //
  const playOrder = useMemo(() => {
    if (mode === "order") return cards.map((_, i) => i);
    const arr = cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [cards, mode]);

  if (cards.length === 0)
    return <div className="text-center p-4 text-white">No cards yet</div>;

  const current = cards[playOrder[index]];

  async function handleSubmit() {
    const isCorrect =
      userAnswer.trim().toLowerCase() === current.answer.trim().toLowerCase();

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));

    setLastResult(
      isCorrect ? "✅ Correct!" : `❌ Wrong — correct: ${current.answer}`
    );

    try {
      await addStat(current.id, isCorrect);
    } catch (e) {
      console.error("Failed to save stat", e);
    }

    setUserAnswer("");
    setIndex((i) => (i + 1 >= playOrder.length ? 0 : i + 1));
  }

  // progressi protsent
  const progress = (index / cards.length) * 100;

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "& input": { color: "white" },
    },
    "& .MuiInputLabel-root": { color: "white" },
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 text-white">
      <h1 className="text-xl font-semibold text-center">Play Mode</h1>

      <div className="flex justify-center mb-4">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          aria-label="mode"
        >
          <ToggleButton
            value="order"
            sx={{
              color: "white",
              "&.Mui-selected": {
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            Order
          </ToggleButton>
          <ToggleButton
            value="random"
            sx={{
              color: "white",
              "&.Mui-selected": {
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            Random
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="flex justify-center mb-2">
        <CircularProgressWithLabel value={progress} />
      </div>

      <div className="p-4 border border-white rounded shadow">
        <p className="mb-2 font-medium">{current.question}</p>

        <TextField
          label="Your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          fullWidth
          size="small"
          sx={inputStyles}
        />

        <div className="flex gap-2 mt-2">
          <Button
            variant="contained"
            sx={{ backgroundColor: "white", color: "black" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>

        {lastResult && (
          <div className="mt-2 text-sm">
            <strong>{lastResult}</strong>
          </div>
        )}
      </div>

      <div className="text-center">
        ✅ {score.correct} | ❌ {score.wrong}
      </div>
    </div>
  );
}
