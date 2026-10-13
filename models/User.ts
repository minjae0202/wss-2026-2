import { Schema, model, models } from "mongoose";

// 비밀번호는 절대로 평문(원문 그대로)으로 저장하지 않습니다.
// passwordHash에는 bcrypt로 해시(단방향 암호화)한 값만 들어갑니다 —
// 이 값을 그대로 봐도 원래 비밀번호를 알 수 없어야 합니다.
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
