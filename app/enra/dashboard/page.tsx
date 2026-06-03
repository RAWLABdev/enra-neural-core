"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Memory = {
  id: string;
  title: string;
  content: string;
  importance: number;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  created_at: string;
};

type Goal = {
  id: string;
  title: string;
  progress: number;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function EnraDashboardPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [memoryRes, taskRes, goalRes, messageRes] = await Promise.all([
        supabase
          .from("enra_memory")
          .select("*")
          .order("importance", { ascending: false }),

        supabase
          .from("enra_tasks")
          .select("*")
          .eq("completed", false)
          .order("created_at", { ascending: false }),

        supabase
          .from("enra_goals")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("enra_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      setMemories(memoryRes.data ?? []);
      setTasks(taskRes.data ?? []);
      setGoals(goalRes.data ?? []);
      setMessages(messageRes.data ?? []);
    };

    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-cyan-50">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.6em] text-cyan-300/50">
            ENRA Neural OS
          </p>

          <h1 className="mt-3 text-5xl font-extralight tracking-[0.18em]">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-cyan-100/50">
            Memoria, tareas, objetivos y actividad reciente del sistema.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Memorias" value={memories.length} />
          <StatCard label="Tareas" value={tasks.length} />
          <StatCard label="Objetivos" value={goals.length} />
          <StatCard label="Mensajes" value={messages.length} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="🧠 Memoria">
            {memories.map((memory) => (
              <Card key={memory.id}>
                <p className="text-sm text-cyan-100">{memory.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-cyan-100/45">
                  {memory.content}
                </p>
              </Card>
            ))}
          </Panel>

          <Panel title="📋 Tareas pendientes">
            {tasks.map((task) => (
              <Card key={task.id}>
                <p className="text-sm text-cyan-100">{task.title}</p>
                <p className="mt-1 text-xs text-cyan-300/40">
                  Prioridad: {task.priority ?? "normal"}
                </p>
              </Card>
            ))}
          </Panel>

          <Panel title="🎯 Objetivos">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-cyan-100">{goal.title}</p>
                  <span className="text-xs text-cyan-300/50">
                    {goal.progress ?? 0}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cyan-300/10">
                  <div
                    className="h-full rounded-full bg-cyan-300/70"
                    style={{ width: `${goal.progress ?? 0}%` }}
                  />
                </div>
              </Card>
            ))}
          </Panel>

          <Panel title="💬 Actividad reciente">
            {messages.map((message) => (
              <Card key={message.id}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/35">
                  {message.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cyan-100/60">
                  {message.content}
                </p>
              </Card>
            ))}
          </Panel>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-cyan-300/10 bg-cyan-300/[0.03] p-5 shadow-[inset_0_0_28px_rgba(34,211,238,0.04)] backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/40">
        {label}
      </p>
      <p className="mt-3 text-4xl font-extralight text-cyan-50">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-cyan-300/10 bg-white/[0.025] p-5 shadow-[0_0_70px_rgba(34,211,238,0.04)] backdrop-blur-xl">
      <h2 className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-200/70">
        {title}
      </h2>

      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
        {children}
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-cyan-300/10 bg-black/30 p-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.035)]">
      {children}
    </div>
  );
}