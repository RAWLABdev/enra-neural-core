"use client";

import NeuralBrain3D from "@/components/enra/NeuralBrain3D";

import { supabase } from "@/lib/supabase";

import { AnimatePresence, motion } from "framer-motion";

import { Mic, Send } from "lucide-react";

import { useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";

  content: string;
};

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type BrowserSpeechRecognition = {
  lang: string;

  continuous: boolean;

  interimResults: boolean;

  start: () => void;

  stop: () => void;

  onresult: ((event: SpeechRecognitionEvent) => void) | null;

  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;

  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;

    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const bars = [8, 14, 22, 12, 28, 16, 10, 20, 12];

export default function EnraCoreBubble() {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const isSpeakingRef = useRef(false);

  const [wakeMode, setWakeMode] = useState(false);

  const [isListening, setIsListening] = useState(false);

  const [input, setInput] = useState("");

  const [expanded, setExpanded] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",

      content: "ENRA Neural Core online. Local intelligence mode active.",
    },
  ]);

  const speak = (text: string) => {
    isSpeakingRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "es-CL";
    utterance.rate = 0.95;
    utterance.pitch = 0.9;

    utterance.onend = () => {
      isSpeakingRef.current = false;

      if (wakeMode && recognitionRef.current) {
        window.setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {}
        }, 600);
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const detectWakeWord = (text: string) => {
    const normalized = text

      .toLowerCase()

      .normalize("NFD")

      .replace(/[\u0300-\u036f]/g, "");

    const wakeWords = ["enrra", "enra", "entra", "endra", "en la", "en a"];

    return wakeWords.find((word) => normalized.includes(word));
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setExpanded(true);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setInput("");

    await supabase.from("enra_messages").insert({
      role: "user",

      content: userMessage,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.action === "focus_mode") {
  const [tasksRes, goalsRes] = await Promise.all([
    supabase
      .from("enra_tasks")
      .select("*")
      .eq("completed", false)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("enra_goals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const tasks = tasksRes.data ?? [];
  const goals = goalsRes.data ?? [];

  const mainGoal =
    goals[0]?.title ?? "mantener claridad y avanzar paso a paso";

  const firstTask =
    tasks[0]?.title ?? "definir una tarea concreta para hoy";

  const taskList =
    tasks.length > 0
      ? tasks.map((task, index) => `${index + 1}. ${task.title}`).join("\n")
      : "No hay tareas pendientes registradas.";

  const assistantMessage = `Rau, tu foco principal ahora es: ${mainGoal}.

Primer paso recomendado:
${firstTask}

Tareas que sostienen ese foco:
${taskList}`;

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: assistantMessage,
    },
  ]);

  speak(assistantMessage);

  await supabase.from("enra_messages").insert({
    role: "assistant",
    content: assistantMessage,
  });

  return;
}
     console.log("ENRA_FRONT_RESPONSE", data);

if (data.action === "create_task") {
  const taskTitle = data.taskTitle || "Tarea sin título";

  const { error } = await supabase.from("enra_tasks").insert({
  title: taskTitle,
  completed: false,
  priority: "normal",
});

  if (error) {
    console.error(
      "ENRA_TASK_INSERT_ERROR",
      JSON.stringify(error, null, 2)
    );
  }

  const assistantMessage = `Tarea registrada: ${taskTitle}`;

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: assistantMessage,
    },
  ]);

  speak(assistantMessage);

  await supabase.from("enra_messages").insert({
    role: "assistant",
    content: assistantMessage,
  });

  return;
}

if (data.action === "get_tasks") {
  const { data: tasks, error } = await supabase
    .from("enra_tasks")
    .select("*")
    .eq("completed", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "ENRA_TASKS_READ_ERROR",
      JSON.stringify(error, null, 2)
    );
  }

  const taskList =
    tasks && tasks.length > 0
      ? tasks.map((task, index) => `${index + 1}. ${task.title}`).join("\n")
      : "No tienes tareas pendientes.";

  const assistantMessage =
    tasks && tasks.length > 0
      ? `Rau, tienes estas tareas pendientes:\n${taskList}`
      : "Rau, no tienes tareas pendientes.";

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: assistantMessage,
    },
  ]);

  speak(assistantMessage);

  await supabase.from("enra_messages").insert({
    role: "assistant",
    content: assistantMessage,
  });

  return;
}

if (data.action === "complete_task") {
  const taskTitle = userMessage
    .replace(/completa tarea/i, "")
    .replace(/marcar tarea/i, "")
    .replace(/terminé tarea/i, "")
    .trim();

  const { error } = await supabase
    .from("enra_tasks")
    .update({ completed: true })
    .ilike("title", `%${taskTitle}%`);

  if (error) {
    console.error("ENRA_TASK_COMPLETE_ERROR", JSON.stringify(error, null, 2));
  }

  const assistantMessage = `Tarea completada: ${taskTitle}`;

  setMessages((prev) => [
    ...prev,
    { role: "assistant", content: assistantMessage },
  ]);

  speak(assistantMessage);

  await supabase.from("enra_messages").insert({
    role: "assistant",
    content: assistantMessage,
  });

  return;
}

      const assistantMessage =
        data.content ?? "ENRA could not generate a response.";

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: assistantMessage,
        },
      ]);

      speak(assistantMessage);

      await supabase.from("enra_messages").insert({
        role: "assistant",

        content: assistantMessage,
      });
    } catch (error) {
      console.error("ENRA_CHAT_ERROR", error);

      const errorMessage = "ENRA local neural network unavailable.";

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: errorMessage,
        },
      ]);

      speak(errorMessage);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendMessage(input);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const message =
        "El reconocimiento de voz no está disponible en este navegador. Prueba con Chrome.";

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: message,
        },
      ]);

      speak(message);

      return;
    }

    if (wakeMode && recognitionRef.current) {
      recognitionRef.current.stop();

      recognitionRef.current = null;

      setWakeMode(false);

      setIsListening(false);

      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "es-CL";

    recognition.continuous = true;

    recognition.interimResults = false;

    setWakeMode(true);

    setIsListening(true);

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      if (isSpeakingRef.current) return;
      const lastResult = event.results[event.results.length - 1][0].transcript;

      const transcript = lastResult.toLowerCase().trim();

      const wakeWord = detectWakeWord(transcript);

      if (!wakeWord) return;

      const command = transcript.replace(wakeWord, "").trim();

      if (!command) {
        const wakeResponse = "Rau, te escucho.";

        setExpanded(true);

        setMessages((prev) => [
          ...prev,

          {
            role: "assistant",

            content: wakeResponse,
          },
        ]);

        speak(wakeResponse);

        return;
      }

      await sendMessage(command);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }

      if (event.error === "audio-capture") {
        const message =
          "No puedo acceder al micrófono. Revisa los permisos de Chrome y macOS.";

        setMessages((prev) => [
          ...prev,

          {
            role: "assistant",

            content: message,
          },
        ]);

        speak(message);

        setIsListening(false);

        setWakeMode(false);

        return;
      }

      console.error("ENRA_SPEECH_ERROR", event.error);

      setIsListening(false);

      setWakeMode(false);
    };

    recognition.onend = () => {
      if (!recognitionRef.current || !wakeMode) {
        setIsListening(false);

        return;
      }

      window.setTimeout(() => {
        try {
          recognition.start();
        } catch {
          setIsListening(false);

          setWakeMode(false);
        }
      }, 450);
    };

    recognition.start();
  };

  

  return (
    <section className="relative z-10 flex items-center justify-center">
      <div className="relative flex h-[min(760px,96vw)] w-[min(760px,96vw)] items-center justify-center">
        <div className="pointer-events-none absolute -inset-[14%]">
          <NeuralBrain3D />
        </div>

        <div className="pointer-events-none absolute -inset-28 rounded-full bg-cyan-300/5 blur-[130px]" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -inset-16 rounded-full opacity-35 blur-3xl"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(125,245,255,0.16) 55deg, transparent 120deg, rgba(34,211,238,0.10) 230deg, transparent 310deg)",
          }}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-6 rounded-full opacity-20 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle at 20% 35%, rgba(125,245,255,0.20), transparent 30%), radial-gradient(circle at 78% 68%, rgba(34,211,238,0.14), transparent 34%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center px-20 py-14">
          <motion.div
            animate={{ opacity: [0.48, 0.86, 0.48] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 flex items-center gap-5"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-300/40" />

            <p className="text-[11px] uppercase tracking-[0.95em] text-cyan-200/70 drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]">
              Neural Core
            </p>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-300/40" />
          </motion.div>

          {/* ENRA mathematical logo */}
          <motion.div
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative mt-7 flex w-[520px] items-center justify-center"
          >
            {/* Deep atmospheric glow */}
            <div className="absolute h-[260px] w-[820px] rounded-full bg-cyan-300/10 blur-[140px]" />

            <div className="absolute h-[180px] w-[620px] rounded-full bg-cyan-200/8 blur-[100px]" />

            <div className="absolute h-[120px] w-[420px] rounded-full bg-white/6 blur-[70px]" />

            <div className="relative grid w-[460px] grid-cols-4 place-items-center">
              {["E", "N", "R", "A"].map((letter, index) => (
                <motion.span
                  key={letter}
                  animate={{
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    delay: index * 0.18,
                  }}
                  className="select-none text-center text-[88px] font-extralight leading-none text-cyan-50"
                  style={{
                    transform: "scaleY(0.82)",
                    textShadow: `
                      0 0 6px rgba(255,255,255,0.25),
                      0 0 16px rgba(34,211,238,0.45),
                      0 0 40px rgba(34,211,238,0.25)
                    `,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <div className="pointer-events-none absolute grid w-[460px] grid-cols-4 place-items-center">
              {["E", "N", "R", "A"].map((letter) => (
                <span
                  key={letter}
                  className="select-none text-[88px] font-extralight leading-none text-cyan-300/12 blur-[26px]"
                  style={{
                    transform: "scaleY(0.82)",
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>

            <div className="absolute top-1/2 h-px w-[430px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/18 to-transparent" />

            <motion.div
              animate={{ x: [-210, 210], opacity: [0, 0.46, 0] }}
              transition={{
                duration: 4.4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 2.6,
              }}
              className="absolute top-1/2 h-[2px] w-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-100 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            />

            <div className="pointer-events-none absolute grid w-[460px] grid-cols-4 place-items-center">
              {["E", "N", "R", "A"].map((letter) => (
                <span
                  key={letter}
                  className="select-none text-[88px] font-thin leading-none text-cyan-300/10 blur-[18px]"
                  style={{
                    transform: "scaleY(0.82)",
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mt-5 h-px w-80 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

          <div className="mt-7 flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-cyan-300/55 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

            <div className="flex flex-col items-center gap-1">
  <p className="text-[10px] uppercase tracking-[0.62em] text-cyan-300/42">
    Local Intelligence Mode Active
  </p>

  <motion.p
    animate={{
      opacity: wakeMode ? [0.45, 1, 0.45] : 0.28,
    }}
    transition={{
      duration: 1.8,
      repeat: wakeMode ? Infinity : 0,
      ease: "easeInOut",
    }}
    className={`text-[9px] uppercase tracking-[0.45em] ${
      wakeMode ? "text-cyan-200" : "text-cyan-300/25"
    }`}
  >
    {wakeMode ? "Wake Mode Active" : "Wake Mode Off"}
  </motion.p>
</div>


            <span className="h-1 w-1 rounded-full bg-cyan-300/55 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="relative mt-7 flex min-h-[230px] w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.96 }}
                  className="flex max-h-[230px] w-full flex-col gap-3 overflow-y-auto px-10"
                >
                  {messages.slice(-4).map((message, index) => (
                    <motion.div
                      key={`${message.content}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[76%] rounded-[24px] border px-5 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "self-end border-cyan-200/20 bg-cyan-300/85 text-black shadow-[0_0_24px_rgba(34,211,238,0.20)]"
                          : "self-start border-cyan-300/12 bg-black/22 text-cyan-50 shadow-[inset_0_0_22px_rgba(34,211,238,0.05)] backdrop-blur-md"
                      }`}
                    >
                      {message.content}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-cyan-300/10 bg-black/16 px-8 py-5 text-center text-sm leading-relaxed text-cyan-50 shadow-[inset_0_0_26px_rgba(34,211,238,0.045),0_0_28px_rgba(34,211,238,0.08)] backdrop-blur-xl"
                >
                  <span className="text-cyan-50/90 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]">
                    ENRA Neural Core online.
                  </span>

                  <br />

                  <span className="text-cyan-300/45">
                    Local intelligence mode active.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            animate={{
              boxShadow: [
                "0 0 18px rgba(34,211,238,0.10)",
                "0 0 42px rgba(34,211,238,0.22)",
                "0 0 18px rgba(34,211,238,0.10)",
              ],
            }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-[66px] w-[430px] items-center rounded-full border border-cyan-300/14 bg-black/28 px-3 backdrop-blur-2xl"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-cyan-300/4"
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-cyan-200 transition ${
                isListening
                  ? "border-cyan-200/60 bg-cyan-300/25 shadow-[0_0_28px_rgba(34,211,238,0.7)]"
                  : "border-cyan-300/14 bg-cyan-300/8 shadow-[0_0_18px_rgba(34,211,238,0.14)] hover:bg-cyan-300/16"
              }`}
            >
              <Mic size={19} strokeWidth={1.8} />
            </button>

            <input
              value={input}
              onFocus={() => setExpanded(true)}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                wakeMode
                  ? "Wake mode: di ENRA..."
                  : isListening
                    ? "Listening..."
                    : "Neural link ready"
              }
              className="relative z-10 mx-4 flex-1 bg-transparent text-center text-[13px] tracking-[0.12em] text-cyan-50 outline-none placeholder:text-center placeholder:text-cyan-300/28"
            />

            <button
              type="submit"
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-200/90 to-cyan-400/90 text-black shadow-[0_0_20px_rgba(34,211,238,0.36)] transition hover:scale-105"
            >
              <Send size={18} strokeWidth={1.9} />
            </button>
          </motion.form>

          {/* Signature */}
          <div className="relative mt-6 h-16 w-full">
            <motion.div
              animate={{ opacity: [0.24, 0.46, 0.24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-4"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-300/25" />

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.9em] text-cyan-200/46 drop-shadow-[0_0_8px_rgba(34,211,238,0.22)]">
                <span>Emma</span>
                <span className="text-cyan-300/25">•</span>
                <span>Nuria</span>
                <span className="text-cyan-300/25">•</span>
                <span>Rau</span>
              </div>

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-300/25" />
            </motion.div>

            <div className="absolute left-1/2 top-9 flex h-7 -translate-x-1/2 items-center justify-center gap-2 opacity-32">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className="flex h-7 w-[2px] items-center justify-center"
                >
                  <motion.span
                    className="h-full w-full origin-center rounded-full bg-cyan-300/65"
                    animate={{
                      scaleY: [height / 56, height / 28, height / 56],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: index * 0.08,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
