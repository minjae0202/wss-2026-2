import Link from "next/link";

// 여러 페이지에서 공통으로 쓰는 상단 내비게이션입니다.
// app/layout.tsx에 한 번만 넣어두면 모든 페이지에 자동으로 보입니다 —
// "재사용 가능한 컴포넌트"의 가장 기본적인 예시입니다.
// 7주차에 로그인 기능이 들어오면 이 자리에 로그인/로그아웃 버튼이 추가됩니다.
export function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-sm font-semibold text-black dark:text-zinc-50">
          웹서버보안프로그래밍
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/products" className="hover:text-black dark:hover:text-zinc-50">
            상품
          </Link>
          <Link href="/notices" className="hover:text-black dark:hover:text-zinc-50">
            공지사항
          </Link>
          <Link
            href="/notices/new"
            className="rounded-md border border-black/[.08] px-3 py-1.5 hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.05]"
          >
            글쓰기
          </Link>
        </nav>
      </div>
    </header>
  );
}
