"use server";

import { createClient } from "@/lib/supabase/server";
import { Card } from "@/types";

export async function getCards(categoryId?: number): Promise<Card[]> {
  const supabase = await createClient();
  let query = supabase.from("cards").select("*");
  if (categoryId !== undefined) query = query.eq("category_id", categoryId);
  const { data, error } = await query.order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Card[];
}

export async function createCard(payload: Omit<Card, "id">) {
  const supabase = await createClient();
  const { error } = await supabase.from("cards").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function updateCard(
  id: number,
  updates: Partial<Omit<Card, "id">>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("cards").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCard(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
