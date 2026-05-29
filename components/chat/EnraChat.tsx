"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function EnraChat() {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setExpanded(true);
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "ENRA Neural Core online. Local intelligence mode active.",
        },
      ]);

      setLoading(false);
    }, 1200);

    setInput("");
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating Messages */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            className="absolute bottom-[140px] flex w-[420px] flex-col gap-4 rounded-[32px] border border-cyan-500/10 bg-black/40 p-6 backdrop-blur-2xl"
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "self-end bg-cyan-400 text-black"
                    : "self-start border border-cyan-500/20 bg-cyan-500/10 text-cyan-100"
                }`}
              >
                {message.content}
              </motion.div>
            ))}

            {loading && (
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/50">
                ENRA thinking...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Bubble */}
      <motion.div
        animate={{
          scale: expanded ? 1.05 : 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative"
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-[80px]" />

        {/* Bubble */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 30px rgba(34,211,238,0.15)",
              "0 0 60px rgba(34,211,238,0.35)",
              "0 0 30px rgba(34,211,238,0.15)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="relative flex h-[90px] w-[520px] items-center rounded-full border border-cyan-500/20 bg-black/50 px-6 backdrop-blur-2xl"
        >
          {/* Mic */}
          <button
            type="button"
            className="mr-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-400/10 text-cyan-300"
          >
            <Mic size={20} />
          </button>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center gap-3"
          >
            <input
              value={input}
              onFocus={() => setExpanded(true)}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk to ENRA..."
              className="flex-1 bg-transparent text-cyan-100 outline-none placeholder:text-cyan-300/30"
            />

            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-black transition hover:scale-105"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}