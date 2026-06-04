export type EnraMemory = {
  title: string;
  content: string;
  importance: number | null;
};

export type EnraMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
};

export type EnraProfileItem = {
  key: string;
  value: string;
};

export type EnraActionResponse =
  | {
      action:
        | "create_task"
        | "get_tasks"
        | "complete_task"
        | "daily_plan"
        | "get_goals"
        | "create_goal"
        | "focus_mode"
        | "coach_mode";
      content?: string;
      taskTitle?: string;
      goalTitle?: string;
    }
  | {
      content: string;
    };