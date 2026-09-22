"use client";
// useFormStatus는 "자신을 감싸고 있는 <form>이 지금 제출 중인가"를
// 알려주는 React 훅입니다. 부모 폼에 상태를 따로 만들지 않아도,
// 이 버튼 컴포넌트 하나로 "저장 중..." 표시를 구현할 수 있습니다.
// 반드시 <form> 안쪽에서 렌더링되는 컴포넌트여야 동작합니다.

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}
