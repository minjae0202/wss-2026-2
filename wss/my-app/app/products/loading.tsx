// 같은 폴더에 loading.tsx를 두면, Next.js가 자동으로 이 파일을
// Suspense fallback으로 감싸줍니다. page.tsx의 데이터 페칭이 끝날
// 때까지(lib/products.ts의 delay) 이 화면이 대신 보입니다.
export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-8 py-16">
      <div className="mb-8 h-7 w-64 animate-pulse rounded bg-black/[.06] dark:bg-white/[.08]" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-black/[.04] dark:bg-white/[.06]"
          />
        ))}
      </div>
    </div>
  );
}
