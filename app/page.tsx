"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import CategoriesPage from "./categories/page";
import CardsPage from "./cards/page";
import PlayMode from "./cards/play";
import StatsPage from "./stats/page";

export default function HomePage() {
  const [view, setView] = useState<"categories" | "cards" | "play" | "stats">(
    "categories"
  );

  return (
    <div>
      <Navbar currentView={view} onChangeView={setView} />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {view === "categories" && <CategoriesPage />}
        {view === "cards" && <CardsPage />}
        {view === "play" && <PlayMode />}
        {view === "stats" && <StatsPage />}
      </div>
    </div>
  );
}
