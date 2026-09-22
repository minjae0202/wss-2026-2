// 5주차부터는 "진짜 코스 프로젝트"인 공지사항 게시판을 만듭니다.
// 지금은 lib/products.ts와 같은 패턴(in-memory + 지연)으로 시작하지만,
// 6주차에는 이 파일 전체가 MongoDB/Mongoose 조회로 바뀝니다.
// 함수 시그니처(getNotices, getNotice, createNotice)는 그대로 유지되므로
// 페이지 컴포넌트 쪽 코드는 거의 바뀌지 않는다는 것이 이번 설계의 핵심입니다.

export type Notice = {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
};

const notices: Notice[] = [
  {
    id: "1",
    title: "웹서버보안프로그래밍 개강 안내",
    author: "이병천",
    content: "2학기 웹서버보안프로그래밍 수업이 시작됩니다. 강의계획서를 확인해주세요.",
    createdAt: "2026-09-01",
  },
  {
    id: "2",
    title: "GitHub Organization 초대 안내",
    author: "이병천",
    content: "과제 제출용 GitHub Organization 초대 메일을 확인하고 가입해주세요.",
    createdAt: "2026-09-03",
  },
  {
    id: "3",
    title: "5주차 실습 — 공지사항 게시판",
    author: "이병천",
    content: "이번 주부터 만드는 공지사항 게시판이 학기 내내 성장하는 코스 프로젝트입니다.",
    createdAt: "2026-09-24",
  },
];

let nextId = 4;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getNotices(): Promise<Notice[]> {
  await delay(600); // 실제 DB 조회를 흉내내는 지연 — loading.tsx가 보이는 이유
  // 최신 글이 위로 오도록 정렬 (실제 DB에서도 흔히 하는 정렬)
  return [...notices].sort((a, b) => (a.id < b.id ? 1 : -1));
}

export async function getNotice(id: string): Promise<Notice | undefined> {
  await delay(400);
  return notices.find((n) => n.id === id);
}

export async function createNotice(input: {
  title: string;
  author: string;
  content: string;
}): Promise<Notice> {
  await delay(300);
  const notice: Notice = {
    id: String(nextId++),
    title: input.title,
    author: input.author,
    content: input.content,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  notices.push(notice);
  return notice;
}
