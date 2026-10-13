import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";

// 비밀번호 해싱 강도(salt round). 숫자가 클수록 안전하지만 느려집니다.
// 10~12 정도가 실무에서 흔히 쓰는 기본값입니다.
const SALT_ROUNDS = 10;

export async function createUser(input: { name: string; email: string; password: string }) {
  await connectDB();

  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  // 여기서 딱 한 번 해싱하고 나면, 이후에는 원본 비밀번호를 서버 어디에도
  // 저장하지 않습니다. 로그인 시에는 입력값을 다시 해싱하는 게 아니라
  // bcrypt.compare로 "해시가 같은지"만 비교합니다 (auth.ts의 authorize 참고).
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  return { id: String(user._id), name: user.name, email: user.email };
}
