# 5주차 — 쉬운 예제 프로젝트

이번 주부터 학기 내내 자라나는 **진짜 코스 프로젝트**를 시작합니다: 공지사항 게시판.
`template/`은 4주차 프로젝트에 목록·상세·글쓰기 화면과 공통 헤더를 이어서 추가한 것입니다.

## 학습 목표

- 지금까지 배운 라우팅·데이터 페칭·Server Action을 하나의 작은 앱으로 통합한다.
- `<form action={...}>`으로 클라이언트 자바스크립트 호출 없이 서버에 데이터를 저장한다.
- `useFormStatus`로 폼 제출 중 상태를 표시하는 작은 Client Component를 분리한다.
- `SiteHeader`처럼 여러 페이지가 함께 쓰는 컴포넌트를 만들어 재사용한다.
- 팀 프로젝트를 위한 Git 브랜치 전략(feature → PR → main)을 이해한다.

## 이 프로젝트가 자라나는 방식

이번 주는 `lib/notices.ts`가 메모리 배열로 데이터를 흉내 냅니다. 앞으로 몇 주 동안
**함수 이름(`getNotices`, `getNotice`, `createNotice`)은 그대로 두고 내부 구현만 교체**하면서
프로젝트를 키워 나갑니다.

- 6주차 — `lib/notices.ts` 내부를 MongoDB/Mongoose 조회로 교체 (페이지 코드는 거의 그대로)
- 7~9주차 — Auth.js 로그인 + 권한(RBAC) 추가
- 10주차~ — 별도의 고급 예제(쇼핑몰)로 난이도를 한 단계 올림

## template/ 폴더 안내 (4주차 대비 추가된 파일)

- `lib/notices.ts` — 임시 데이터 + `getNotices` / `getNotice` / `createNotice` (6주차에 MongoDB로 교체 예정)
- `lib/actions.ts` — Server Action `createNoticeAction(formData)` 추가 (폼에 직접 연결, 검증 + `redirect()`)
- `app/notices/page.tsx` — 공지 목록 (Server Component, `await getNotices()`)
- `app/notices/loading.tsx` — 목록을 기다리는 동안 자동으로 보이는 스켈레톤 UI
- `app/notices/[id]/page.tsx` — 동적 라우팅 상세 페이지, 없는 id는 `notFound()`
- `app/notices/new/page.tsx` — 글쓰기 폼 (`<form action={createNoticeAction}>`, Server Component)
- `components/SubmitButton.tsx` — `useFormStatus`로 제출 중 상태를 보여주는 Client Component
- `components/SiteHeader.tsx` — 모든 페이지 상단에 붙는 공통 내비게이션 (`app/layout.tsx`에서 렌더)

### 실행해보기

```bash
cd template
npm install
npm run dev
# http://localhost:3000 접속 → /notices, /notices/new 도 함께 확인
```

> 4주차와 마찬가지로 `npx tsc --noEmit`, `npx eslint .` 모두 (clean `.next` 상태에서) 통과를 확인했습니다.
> `npm run build`는 이 샌드박스의 네트워크 제한(Google Fonts) 때문에만 실패할 수 있습니다.

## 이번 주 체크리스트 (과제 #3)

- [ ] 공지사항 게시판에 필드 하나 추가 (예: 조회수, 카테고리 등) — `lib/notices.ts`, 폼, 상세 페이지를 함께 수정
- [ ] 목록의 `<li>` 항목처럼 컴포넌트 하나를 더 분리해 재사용화 해보기
- [ ] `feature/week05` 같은 이름으로 브랜치를 만들어 작업 후 PR로 병합해보기
- [ ] 레포에 push (`assignments-<학번>` 권장) → Vercel 배포 → submissions-2026에 repo_url · commit_sha · deploy_url PR 제출

## 슬라이드

`slides/week05.pptx`

## 이전 / 다음 주

- 이전: [week04](../week04/README.md)
- 다음: [week06](../week06/README.md)
