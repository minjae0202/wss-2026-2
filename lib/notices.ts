// 5주차의 in-memory 배열을 실제 MongoDB 조회로 교체했습니다.
// export하는 타입(Notice)과 함수 시그니처(getNotices/getNotice/createNotice)는
// 5주차와 완전히 동일합니다 — 그래서 app/notices/*.tsx 쪽 코드는
// 단 한 줄도 바꾸지 않았습니다. "데이터 계층을 갈아끼운다"는 것이
// 실무에서 어떤 의미인지 직접 보여주는 것이 이번 주의 핵심입니다.

import { connectDB } from "./mongodb";
import { Notice as NoticeModel } from "@/models/Notice";

export type Notice = {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  views: number;
};

// Mongoose 문서를 화면에서 쓰는 평범한 객체(Notice)로 변환합니다.
// _id(ObjectId)는 문자열로, createdAt(Date)은 YYYY-MM-DD 문자열로 바꿉니다.
type NoticeDocLike = {
  _id: unknown;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
  views?: number;
};

function toNotice(doc: NoticeDocLike): Notice {
  return {
    id: String(doc._id),
    title: doc.title,
    author: doc.author,
    content: doc.content,
    createdAt: (doc.createdAt ?? new Date()).toISOString().slice(0, 10),
    views: doc.views ?? 0,
  };
}

// 처음 실습할 때 컬렉션이 비어있으면 화면이 휑하니, 문서가 하나도
// 없을 때만 예시 데이터 3개를 자동으로 넣어줍니다. (실제 서비스라면
// 이런 시드 로직은 별도 스크립트로 분리하는 것이 더 안전합니다.)
async function seedIfEmpty() {
  const count = await NoticeModel.countDocuments();
  if (count > 0) return;

  await NoticeModel.insertMany([
    {
      title: "웹서버보안프로그래밍 개강 안내",
      author: "김민재",
      content: "2학기 웹서버보안프로그래밍 수업이 시작됩니다. 강의계획서를 확인해주세요.",
    },
    {
      title: "GitHub Organization 초대 안내",
      author: "김민재",
      content: "과제 제출용 GitHub Organization 초대 메일을 확인하고 가입해주세요.",
    },
    {
      title: "6주차 실습 — MongoDB 연동",
      author: "김민재",
      content: "이번 주부터 공지사항 게시판이 실제 데이터베이스에 저장됩니다.",
    },
  ]);
}

export async function getNotices(): Promise<Notice[]> {
  await connectDB();
  await seedIfEmpty();
  const docs = await NoticeModel.find().sort({ createdAt: -1 }).lean();
  return docs.map((doc) => toNotice(doc as NoticeDocLike));
}

export async function getNotice(id: string): Promise<Notice | undefined> {
  await connectDB();
  try {
    // 상세 페이지를 볼 때마다 조회수를 1 증가시키면서 최신 문서를 받아옵니다.
    const doc = await NoticeModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    return doc ? toNotice(doc as NoticeDocLike) : undefined;
  } catch {
    // id가 MongoDB ObjectId 형식이 아니면 findByIdAndUpdate가 에러를 던집니다.
    // 사용자에게는 스택 트레이스 대신 "찾을 수 없음"으로만 보여줍니다.
    return undefined;
  }
}

export async function createNotice(input: {
  title: string;
  author: string;
  content: string;
}): Promise<Notice> {
  await connectDB();
  const doc = await NoticeModel.create(input);
  return toNotice(doc);
}
