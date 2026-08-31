"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { toKoreanAuthMessage } from "@/lib/authErrors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const canSubmit = email !== "" && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error(toKoreanAuthMessage(error));
      return;
    }

    setIsSent(true);
    toast.success("비밀번호 재설정 링크를 이메일로 보냈습니다.");
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-4 py-14">
      <div className="card w-full max-w-sm">
        <h1 className="mb-8 text-center text-[22px] font-semibold tracking-[-0.3px] text-[var(--text)]">
          북마크
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary mt-2 w-full text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            비밀번호 재설정 링크 보내기
          </button>
        </form>

        {isSent && (
          <p className="mt-4 text-center text-sm text-[var(--text-sub)]">
            이메일로 전송된 링크를 확인해주세요.
          </p>
        )}

        <p className="mt-4 text-center text-sm text-[var(--text-sub)]">
          <Link href="/login" className="font-medium text-[var(--text)] underline">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
