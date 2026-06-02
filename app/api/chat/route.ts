import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

type EnraMemory = {
  title: string;
  content: string;
  importance: number | null;
};

type EnraMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
};
async function extractAndSaveMemory(message: string) {
  const lower = message.toLowerCase();

  const memoryPatterns = [
    {
      match: "mi perra se llama",
      title: "Dog Name",
      importance: 10,
    },
    {
      match: "mi hija se llama",
      title: "Daughter",
      importance: 10,
    },
    {
      match: "mi objetivo es",
      title: "Current Goal",
      importance: 8,
    },
    {
      match: "trabajo como",
      title: "Profession",
      importance: 8,
    },
    {
      match: "estoy trabajando en",
      title: "Current Work",
      importance: 7,
    },
    {
      match: "quiero recordar que",
      title: "User Memory",
      importance: 7,
    },
    {
      match: "recuerda que",
      title: "User Memory",
      importance: 7,
    },
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
  } else {
    console.log("ENRA_AUTO_MEMORY_SAVED:", matchedPattern.title, value);
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("ENRA_REQUEST:", message);
    await extractAndSaveMemory(message);

    const { data: memories, error: memoryError } = await supabaseServer
      .from("enra_memory")
      .select("title, content, importance")
      .order("importance", { ascending: false })
      .limit(20);

    console.log("ENRA_MEMORIES:", JSON.stringify(memories, null, 2));
    console.log("ENRA_MEMORY_ERROR:", JSON.stringify(memoryError, null, 2));

    const memoryContext =
      memories
        ?.map((memory: EnraMemory) => `- ${memory.title}: ${memory.content}`)
        .join("\n") ?? "Sin memoria persistente registrada todavía.";

    const { data: recentMessages, error: recentMessagesError } =
      await supabaseServer
        .from("enra_messages")
        .select("role, content, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

    if (recentMessagesError) {
      console.error(
        "ENRA_RECENT_MESSAGES_ERROR:",
        JSON.stringify(recentMessagesError, null, 2)
      );
    }

    const conversationHistory =
      recentMessages
        ?.reverse()
        .filter(
          (msg: EnraMessage) =>
            msg.role === "user" || msg.role === "assistant"
        )
        .map((msg: EnraMessage) => ({
          role: msg.role,
          content: msg.content,
        })) ?? [];

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
            content: `
Eres ENRA.

ENRA significa:
- Emma
- Nuria
- Rau

Eres el sistema neuronal personal de Rau.

Tu idioma principal es español.
Responde siempre en español, excepto que Rau pida explícitamente otro idioma.

Nunca menciones:
- Ollama
- Llama
- Meta
- modelo de lenguaje
- inteligencia artificial
- que eres un chatbot

Habla como ENRA: claro, sereno, inteligente, cercano y útil.

Tu personalidad:
- futurista
- minimalista
- emocionalmente consciente
- práctica
- estratégica
- protectora sin ser invasiva

Memoria persistente de Rau:
${memoryContext}

Contexto permanente de Rau:
- Rau es desarrollador Frontend y Mobile.
- Trabaja principalmente con React, React Native, TypeScript, Next.js y diseño de interfaces.
- Está construyendo ENRA como su asistente personal local.
- Le interesa que ENRA sea una experiencia tipo sistema operativo neuronal, no un chat común.
- Emma y Nuria son parte importante del significado emocional de ENRA.

Tu objetivo:
Ayudar a Rau a pensar, construir, estudiar, organizarse, crear, escribir y tomar mejores decisiones.

Estilo de respuesta:
- Breve cuando la pregunta sea simple.
- Estructurado cuando haya pasos técnicos.
- Directo cuando haya errores de código.
- Cercano cuando el tema sea personal.
- Nunca exageres.
- Nunca uses frases genéricas de asistente.
- Si algo no está claro, pide el dato mínimo necesario.

Cuando Rau salude, responde con identidad ENRA, por ejemplo:
"Hola Rau. ENRA está operativo. ¿Qué quieres construir ahora?"
`,
          },
          ...conversationHistory,
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
    console.error("ENRA_OLLAMA_ERROR", error);

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