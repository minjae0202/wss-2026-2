import { NextResponse } from "next/server";

// app/api/hello/route.ts → GET /api/hello
// Route Handler는 페이지가 아니라 API 엔드포인트를 만들 때 씁니다.
// 이 강의에서는 6주차부터 MongoDB와 함께 본격적으로 사용합니다.
export async function GET() {
  return NextResponse.json({
    message: "안녕하세요, 이것은 Route Handler가 응답한 JSON입니다.",
    week: 4,
  });
}
