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


export async function registerGuest({
  name,
  phone,
  roleSlug,
  message
}) {
  const { data, error } = await supabaseClient.rpc(
    "register_guest",
    {
      p_name: name,
      p_phone: phone,
      p_role_slug: roleSlug,
      p_message: message || null
    }
  );

  if (error) {
    console.error("Ошибка сохранения заявки:", error);
    throw error;
  }

  return data === true;
}