import { supabaseClient } from "./supabase.js";

export async function loadRoles() {
  const { data, error } = await supabaseClient
    .from("roles")
    .select("slug, name, is_taken, is_unlimited");

  if (error) {
    console.error("Не удалось загрузить роли:", error);
    return;
  }

  const roleSelect = document.querySelector(
    'select[name="role"]'
  );

  if (!roleSelect) return;

  data.forEach((role) => {
    const option = roleSelect.querySelector(
      `option[value="${role.slug}"]`
    );

    if (!option) return;

    // Многоразовая роль
    if (role.is_unlimited) {
      option.disabled = false;
      option.textContent = role.name;
      return;
    }

    // Уникальная роль уже занята
    if (role.is_taken) {
      option.disabled = true;
      option.textContent =
        `${role.name} · уже занято ♡`;
    }
  });
}


export async function takeRole(roleSlug) {
  const { data, error } = await supabaseClient.rpc(
    "take_role",
    {
      role_slug: roleSlug
    }
  );

  if (error) {
    console.error(
      "Ошибка занятия роли:",
      error
    );

    throw error;
  }

  return data === true;
}