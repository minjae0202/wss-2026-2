"use client";
// 서버 액션(likeProductAction)을 호출해야 하므로 Client Component입니다.
// useTransition으로 "요청 중" 상태를 표시해, 버튼을 여러 번 눌러도
// 자연스럽게 처리되도록 합니다.

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { likeProductAction } from "@/lib/actions";

export function LikeButton({ id, initialLikes }: { id: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const newLikes = await likeProductAction(id);
          setLikes(newLikes);
        });
      }}
    >
      {isPending ? "저장 중..." : `♥ 좋아요 ${likes}`}
    </Button>
  );
}
