export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage =
    messages[messages.length - 1]?.parts?.[0]?.text ||
    "Hello";

  return Response.json({
    role: "assistant",
    content: `
ENRA Neural Core online.

Local inference mode pending.

Last message received:
"${lastMessage}"

Ollama integration ready.
`,
  });
}