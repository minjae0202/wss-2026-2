import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Auth.js(NextAuth) v5 설정 파일입니다. 관례상 프로젝트 루트에 둡니다 —
// middleware.ts 등 여러 곳에서 이 파일의 auth()를 그대로 불러 쓰기 위해서입니다.
//
// Credentials Provider = "우리 DB의 이메일/비밀번호로 직접 로그인"하는 방식입니다.
// (2주차에 소개했던 Clerk 같은 외부 인증 서비스와 달리, 로그인 로직을 직접 작성합니다.)
// 세션은 데이터베이스가 아니라 서명된 JWT 쿠키로 관리합니다 — Credentials Provider를
// 쓸 때 Auth.js의 기본 방식입니다.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return null; // 존재하지 않는 이메일

        // bcrypt.compare: 입력한 비밀번호를 다시 해싱해서 저장된 해시와 비교합니다.
        // 해시를 복호화하는 게 아니라 "같은 입력이면 같은 해시가 나온다"는 원리를 씁니다.
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null; // 비밀번호 불일치

        // 여기서 반환하는 값이 세션(JWT)에 담깁니다 — passwordHash는 절대 포함하지 않습니다.
        return { id: String(user._id), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
