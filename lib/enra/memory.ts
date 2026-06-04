import { supabaseServer } from "@/lib/supabase-server";
import type { EnraMemory } from "./types";

export async function extractAndSaveMemory(message: string) {
  const lower = message.toLowerCase();

  const memoryPatterns = [
    { match: "mi perra se llama", title: "Dog Name", importance: 10 },
    { match: "mi hija se llama", title: "Daughter", importance: 10 },
    { match: "mi objetivo es", title: "Current Goal", importance: 8 },
    { match: "trabajo como", title: "Profession", importance: 8 },
    { match: "estoy trabajando en", title: "Current Work", importance: 7 },
    { match: "quiero recordar que", title: "User Memory", importance: 7 },
    { match: "recuerda que", title: "User Memory", importance: 7 },
  ];

  const matchedPattern = memoryPatterns.find((pattern) =>
    lower.includes(pattern.match)
  );

  if (!matchedPattern) return;

  const value = message
    .slice(lower.indexOf(matchedPattern.match) + matchedPattern.match.length)
    .trim()
    .replace(/^[:,-]\s*/, "");

  if (!value) return;

  const { error } = await supabaseServer.from("enra_memory").insert({
    title: matchedPattern.title,
    content: value,
    importance: matchedPattern.importance,
  });

  if (error) {
    console.error("ENRA_AUTO_MEMORY_ERROR:", JSON.stringify(error, null, 2));
  }
}

export async function getMemories() {
  const { data, error } = await supabaseServer
    .from("enra_memory")
    .select("title, content, importance")
    .order("importance", { ascending: false })
    .limit(20);

  if (error) {
    console.error("ENRA_MEMORY_ERROR:", JSON.stringify(error, null, 2));
  }

  return data as EnraMemory[] | null;
}

export function buildMemoryContext(memories: EnraMemory[] | null) {
  return (
    memories?.map((memory) => `- ${memory.title}: ${memory.content}`).join("\n") ??
    "Sin memoria persistente registrada todavía."
  );
}