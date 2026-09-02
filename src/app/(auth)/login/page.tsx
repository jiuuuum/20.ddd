"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { toKoreanAuthMessage } from "@/lib/authErrors";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = email !== "" && password !== "" && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (error) {
      toast.error(toKoreanAuthMessage(error));
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleKakaoLogin() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      toast.error(toKoreanAuthMessage(error));
    }
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
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary mt-2 w-full text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            로그인
          </button>
        </form>

        <button type="button" onClick={handleKakaoLogin} className="mt-3 block w-full">
          <Image
            src="/kakao_login_large_wide.png"
            alt="카카오 로그인"
            width={600}
            height={90}
            className="h-auto w-full"
          />
        </button>

        <p className="mt-4 text-center text-sm text-[var(--text-sub)]">
          <Link href="/forgot-password" className="font-medium text-[var(--text)] underline">
            비밀번호 찾기
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-[var(--text-sub)]">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-[var(--text)] underline">
            회원가입
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[var(--text-sub)]">
          <a
            href="https://77-5jcc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--text)] underline"
          >
            마임축제 사이트 바로가기
          </a>
        </p>
      </div>
    </div>
  );
}
