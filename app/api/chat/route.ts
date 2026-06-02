import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

type EnraMemory = {
  title: string;
  content: string;
  importance: number | null;
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("ENRA_REQUEST:", message);

    const { data: memories, error: memoryError } =
  await supabaseServer
    .from("enra_memory")
    .select("*");

console.log(
  "ENRA_MEMORIES:",
  JSON.stringify(memories, null, 2)
);

console.log(
  "ENRA_MEMORY_ERROR:",
  JSON.stringify(memoryError, null, 2)
);

    const memoryContext =
      memories
        ?.map(
          (memory: EnraMemory) =>
            `- ${memory.title}: ${memory.content}`
        )
        .join("\n") ?? "Sin memoria persistente registrada todavía.";

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