import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui 컴포넌트들이 공통으로 쓰는 헬퍼입니다.
// Tailwind 클래스를 조건부로 합치면서, 충돌하는 클래스는 뒤에 온 것이
// 이기도록 정리해줍니다 (예: "px-2" + "px-4" → "px-4"만 남음).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
