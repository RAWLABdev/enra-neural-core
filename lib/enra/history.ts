import { supabaseServer } from "@/lib/supabase-server";
import type { EnraMessage } from "./types";

export async function getConversationHistory() {
  const { data, error } = await supabaseServer
    .from("enra_messages")
    .select("role, content, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("ENRA_RECENT_MESSAGES_ERROR:", JSON.stringify(error, null, 2));
  }

  return (
    data
      ?.reverse()
      .filter(
        (msg: EnraMessage) => msg.role === "user" || msg.role === "assistant"
      )
      .map((msg: EnraMessage) => ({
        role: msg.role,
        content: msg.content,
      })) ?? []
  );
}