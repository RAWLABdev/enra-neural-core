import { supabase } from "@/lib/supabase";

export async function createTask(title: string) {
  return supabase.from("enra_tasks").insert({
    title,
  });
}

export async function getPendingTasks() {
  return supabase
    .from("enra_tasks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
}