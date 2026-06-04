import { supabaseServer } from "@/lib/supabase-server";
import type { EnraProfileItem } from "./types";

export async function getProfile() {
  const { data, error } = await supabaseServer
    .from("enra_profile")
    .select("key, value");

  if (error) {
    console.error("ENRA_PROFILE_ERROR:", JSON.stringify(error, null, 2));
  }

  return data as EnraProfileItem[] | null;
}

export function getProfileValue(
  profile: EnraProfileItem[] | null,
  key: string
) {
  return profile?.find((item) => item.key === key)?.value;
}

export function buildProfileContext(profile: EnraProfileItem[] | null) {
  return (
    profile?.map((item) => `${item.key}: ${item.value}`).join("\n") ??
    "Sin perfil estructurado registrado todavía."
  );
}