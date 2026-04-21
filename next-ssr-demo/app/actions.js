"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function savePreferredCategory(formData) {
  const category = formData.get("category");

  cookies().set("preferredCategory", String(category || "all"), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30
  });

  revalidatePath("/");
}
