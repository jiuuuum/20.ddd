"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { toKoreanAuthMessage } from "@/lib/authErrors";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = password !== "" && passwordConfirm !== "" && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      toast.error(toKoreanAuthMessage(error));
      return;
    }

    toast.success("비밀번호가 변경되었습니다.");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-4 py-14">
      <div className="card w-full max-w-sm">
        <h1 className="mb-8 text-center text-[22px] font-semibold tracking-[-0.3px] text-[var(--text)]">
          북마크
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary mt-2 w-full text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </div>
  );
}
