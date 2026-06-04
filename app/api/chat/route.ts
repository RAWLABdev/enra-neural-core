import { handleActions } from "@/lib/enra/actions";
import { getConversationHistory } from "@/lib/enra/history";
import {
  buildMemoryContext,
  extractAndSaveMemory,
  getMemories,
} from "@/lib/enra/memory";
import { buildSystemPrompt } from "@/lib/enra/prompt";
import { buildProfileContext, getProfile } from "@/lib/enra/profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("ENRA_REQUEST:", message);

    const profile = await getProfile();

    const actionResponse = handleActions(message, profile);

    if (actionResponse) {
      return NextResponse.json(actionResponse);
    }

    await extractAndSaveMemory(message);

    const memories = await getMemories();
    const history = await getConversationHistory();

    const profileContext = buildProfileContext(profile);
    const memoryContext = buildMemoryContext(memories);
    const systemPrompt = buildSystemPrompt(profileContext, memoryContext);

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        stream: false,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...history,
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log("OLLAMA_RESPONSE:", data);

    return NextResponse.json({
      content: data?.message?.content ?? "ENRA response unavailable.",
    });
  } catch (error) {
    console.error("ENRA_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        content: "ENRA neural network unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}