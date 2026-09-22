"use server";
// 이 파일의 함수들은 Server Action입니다. 클라이언트 컴포넌트에서
// 그냥 함수처럼 import해서 호출하면, Next.js가 자동으로 서버에
// 요청을 보내고 결과를 받아옵니다 — 별도의 API 엔드포인트를
// 직접 만들지 않아도 됩니다. (6주차 MongoDB CRUD에서 본격적으로 사용)

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { likeProduct as likeProductInDb } from "@/lib/products";
import { createNotice } from "@/lib/notices";

export async function likeProductAction(id: string) {
  const newLikes = await likeProductInDb(id);
  // 이 경로를 다시 그리도록 Next.js에 알려줍니다 — 다른 탭/새로고침에서도
  // 최신 좋아요 수가 보이게 합니다.
  revalidatePath(`/products/${id}`);
  return newLikes;
}

// 4주차의 likeProductAction과 달리, 이 액션은 <form action={...}>에
// 직접 연결됩니다. 함수를 호출하는 자바스크립트 코드 없이도 폼이
// 제출되면 Next.js가 FormData를 담아 이 함수를 서버에서 실행합니다.
// 즉 이 페이지는 클라이언트 자바스크립트가 없어도 기본 동작이 가능합니다.
export async function createNoticeAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    // 실습 단계의 아주 단순한 검증입니다.
    // 실제 서비스라면 에러 상태를 돌려주고 폼에 메시지를 보여줘야 합니다.
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  const notice = await createNotice({ title, author, content });
  revalidatePath("/notices");
  redirect(`/notices/${notice.id}`);
}
