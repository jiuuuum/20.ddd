import type { AuthError } from "@supabase/supabase-js";

const ERROR_MESSAGE_MAP: { match: RegExp; message: string }[] = [
  { match: /invalid login credentials/i, message: "이메일 또는 비밀번호가 올바르지 않습니다." },
  { match: /email not confirmed/i, message: "이메일 인증이 완료되지 않았습니다." },
  { match: /user already registered/i, message: "이미 가입된 이메일입니다." },
  { match: /password should be at least/i, message: "비밀번호는 6자 이상이어야 합니다." },
  { match: /unable to validate email address/i, message: "이메일 형식이 올바르지 않습니다." },
  { match: /rate limit/i, message: "잠시 후 다시 시도해주세요." },
];

export function toKoreanAuthMessage(error: AuthError | { message?: string } | null) {
  const raw = error?.message ?? "";
  const found = ERROR_MESSAGE_MAP.find(({ match }) => match.test(raw));
  return found ? found.message : "오류가 발생했습니다. 다시 시도해주세요.";
}
