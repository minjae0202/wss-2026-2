'use client'
export default function NoticesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-8 py-24 text-center">
      <p className="text-lg font-medium text-black dark:text-zinc-50">
        공지사항을 불러오지 못했습니다.
      </p>
      <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        일시적인 서버/DB 연결 문제일 수 있습니다. 잠시 후 다시 시도해주세요.
        {error.digest && ` (참고번호: ${error.digest})`}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.05]"
      >
        다시 시도
      </button>
    </div>
  )
}
