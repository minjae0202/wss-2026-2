"use client";
// 이 파일 맨 위의 "use client"가 Server ↔ Client의 경계선입니다.
// useState처럼 브라우저 상태가 필요한 코드는 반드시 Client Component
// 안에 있어야 합니다 — 이 선언이 없으면 useState는 에러가 납니다.

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-black/[.08] px-4 py-3 dark:border-white/[.145]">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Client Component (버튼을 눌러보세요)
      </span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        {count}
      </button>
    </div>
  );
}
