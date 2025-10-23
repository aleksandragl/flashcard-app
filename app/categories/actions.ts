"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert([{ name }]);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
//lisaks update
export async function updateCategory(id: number, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
