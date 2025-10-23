"use server";

import { createClient } from "@/lib/supabase/server";
import { Stat } from "@/types";

export async function addStat(card_id: number, is_correct: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("stats")
    .insert([{ card_id, is_correct }]);
  if (error) throw new Error(error.message);
}

export async function getStatsForCard(card_id: number): Promise<Stat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("card_id", card_id)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Stat[];
}

export async function getStatsSummaryForCard(card_id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .select("is_correct")
    .eq("card_id", card_id);

  if (error) throw new Error(error.message);

  const rows: Pick<Stat, "is_correct">[] = data ?? [];
  const correct = rows.filter((r) => r.is_correct).length;
  const wrong = rows.filter((r) => !r.is_correct).length;

  return { correct, wrong };
}
