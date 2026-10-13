"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { likeProduct as likeProductInDb } from "@/lib/products";
import { createNotice } from "@/lib/notices";
import { createUser } from "@/lib/users";
import { signIn, signOut } from "@/auth";

export async function likeProductAction(id: string) {
  const newLikes = await likeProductInDb(id);
  revalidatePath(`/products/${id}`);
  return newLikes;
}

export async function createNoticeAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  const notice = await createNotice({ title, author, content });
  revalidatePath("/notices");
  redirect(`/notices/${notice.id}`);
}

// 회원가입: 비밀번호를 해싱해 User 컬렉션에 저장한 뒤, 곧바로 로그인까지
// 이어서 처리합니다. signIn()이 성공하면 내부적으로 리다이렉트를 던지므로
// registerAction은 반환값을 따로 처리하지 않습니다.
export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    throw new Error("이름, 이메일, 비밀번호를 모두 입력해주세요.");
  }
  if (password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야 합니다.");
  }

  await createUser({ name, email, password });
  await signIn("credentials", { email, password, redirectTo: "/" });
}

// 로그인. Auth.js는 로그인 실패도 "에러를 던지는 방식"으로 알려줍니다.
// AuthError만 따로 잡아서 /login?error=1 로 돌려보내고, 그 외의 에러
// (Next.js의 리다이렉트 신호 포함)는 그대로 다시 던져야 합니다 — 여기서
// 삼켜버리면 로그인 성공 후 리다이렉트까지 막혀버립니다.
export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
