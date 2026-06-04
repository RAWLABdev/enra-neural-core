import type { EnraActionResponse, EnraProfileItem } from "./types";
import { getProfileValue } from "./profile";

function extractTaskTitle(message: string) {
  return message
    .replace(/enrra/gi, "")
    .replace(/enra/gi, "")
    .replace(/agrega tarea/gi, "")
    .replace(/crear tarea/gi, "")
    .replace(/nueva tarea/gi, "")
    .trim()
    .replace(/^[:,-]\s*/, "");
}

function extractGoalTitle(message: string) {
  return message
    .replace(/enrra/gi, "")
    .replace(/enra/gi, "")
    .replace(/crea objetivo/gi, "")
    .replace(/crear objetivo/gi, "")
    .replace(/nuevo objetivo/gi, "")
    .trim()
    .replace(/^[:,-]\s*/, "");
}

export function handleActions(
  message: string,
  profile: EnraProfileItem[] | null
): EnraActionResponse | null {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("cuál es mi linkedin") ||
    lowerMessage.includes("cual es mi linkedin")
  ) {
    const linkedin = getProfileValue(profile, "linkedin");

    return {
      content: linkedin ?? "No encontré tu LinkedIn en el perfil.",
    };
  }

  if (
    lowerMessage.includes("cuál es mi portafolio") ||
    lowerMessage.includes("cual es mi portafolio") ||
    lowerMessage.includes("cuál es mi portfolio") ||
    lowerMessage.includes("cual es mi portfolio")
  ) {
    const portfolio = getProfileValue(profile, "portfolio");

    return {
      content: portfolio ?? "No encontré tu portafolio en el perfil.",
    };
  }

  if (
    lowerMessage.includes("cuál es mi github") ||
    lowerMessage.includes("cual es mi github")
  ) {
    const github = getProfileValue(profile, "github");

    return {
      content: github ?? "No encontré tu GitHub en el perfil.",
    };
  }

  if (
    lowerMessage.includes("cuál es mi meta de peso") ||
    lowerMessage.includes("cual es mi meta de peso") ||
    lowerMessage.includes("peso objetivo")
  ) {
    const weightGoal = getProfileValue(profile, "weight_goal");

    return {
      content: weightGoal
        ? `Tu meta de peso es ${weightGoal} kg.`
        : "No encontré una meta de peso registrada.",
    };
  }

  if (
    lowerMessage.includes("cuál es mi peso actual") ||
    lowerMessage.includes("cual es mi peso actual")
  ) {
    const currentWeight = getProfileValue(profile, "weight_current");

    return {
      content: currentWeight
        ? `Tu peso actual registrado es ${currentWeight} kg.`
        : "No encontré tu peso actual registrado.",
    };
  }

  if (
    lowerMessage.includes("agrega tarea") ||
    lowerMessage.includes("crear tarea") ||
    lowerMessage.includes("nueva tarea")
  ) {
    return {
      action: "create_task",
      content: message,
      taskTitle: extractTaskTitle(message),
    };
  }

  if (
    lowerMessage.includes("qué tareas tengo") ||
    lowerMessage.includes("que tareas tengo") ||
    lowerMessage.includes("tareas pendientes") ||
    lowerMessage.includes("qué tengo pendiente") ||
    lowerMessage.includes("que tengo pendiente")
  ) {
    return {
      action: "get_tasks",
    };
  }

  if (
    lowerMessage.includes("completa tarea") ||
    lowerMessage.includes("marcar tarea") ||
    lowerMessage.includes("terminé tarea")
  ) {
    return {
      action: "complete_task",
      content: message,
    };
  }

  if (
    lowerMessage.includes("qué debo hacer hoy") ||
    lowerMessage.includes("que debo hacer hoy") ||
    lowerMessage.includes("plan de hoy") ||
    lowerMessage.includes("organiza mi día") ||
    lowerMessage.includes("organiza mi dia")
  ) {
    return {
      action: "daily_plan",
    };
  }

  if (
    lowerMessage.includes("mis objetivos") ||
    lowerMessage.includes("qué objetivos tengo") ||
    lowerMessage.includes("que objetivos tengo")
  ) {
    return {
      action: "get_goals",
    };
  }

  if (
    lowerMessage.includes("crea objetivo") ||
    lowerMessage.includes("crear objetivo") ||
    lowerMessage.includes("nuevo objetivo")
  ) {
    return {
      action: "create_goal",
      content: message,
      goalTitle: extractGoalTitle(message),
    };
  }

  if (
    lowerMessage.includes("cuál es mi foco") ||
    lowerMessage.includes("cual es mi foco") ||
    lowerMessage.includes("qué debería hacer primero") ||
    lowerMessage.includes("que deberia hacer primero") ||
    lowerMessage.includes("en qué me enfoco") ||
    lowerMessage.includes("en que me enfoco")
  ) {
    return {
      action: "focus_mode",
    };
  }

  if (
  lowerMessage.includes("coach") ||
  lowerMessage.includes("modo coach") ||
  lowerMessage.includes("ayúdame a pensar") ||
  lowerMessage.includes("ayudame a pensar")
) {
  return {
    action: "coach_mode",
  };
}

  return null;
}