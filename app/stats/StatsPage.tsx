"use client";

import { useEffect, useState } from "react";
import { getCards } from "../cards/actions";
import { getStatsSummaryForCard } from "./actions";
import { Card as CardType } from "@/types";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

export default function StatsPage({ categoryId }: { categoryId?: number }) {
  //uuendatud
  const [cards, setCards] = useState<CardType[]>([]);
  const [stats, setStats] = useState<
    Record<number, { correct: number; wrong: number }>
  >({});

  useEffect(() => {
    async function loadCardsAndStats() {
      const data = await getCards(categoryId);
      setCards(data);

      const statsObj: typeof stats = {};
      for (const card of data) {
        const summary = await getStatsSummaryForCard(card.id);
        statsObj[card.id] = summary;
      }
      setStats(statsObj);
    }
    loadCardsAndStats();
  }, [categoryId]);

  if (cards.length === 0)
    return <div className="p-4 text-center text-white">No cards yet</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Typography
        variant="h5"
        className="text-center font-semibold"
        sx={{ color: "white" }}
      >
        Statistics
      </Typography>
      <List>
        {cards.map((card) => {
          const cardStats = stats[card.id] || { correct: 0, wrong: 0 };
          return (
            <ListItem
              key={card.id}
              sx={{
                flexDirection: "column",
                border: "1px solid white",
                p: 2,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={card.question}
                secondary={`✅ Correct: ${cardStats.correct} | ❌ Wrong: ${cardStats.wrong}`}
                primaryTypographyProps={{ sx: { color: "white" } }}
                secondaryTypographyProps={{ sx: { color: "white" } }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
