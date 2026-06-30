"use client";

/** Form login admin → simpan JWT → redirect ke Kelola Materi. */

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { setToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface LoginResponse {
  token: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await api<LoginResponse>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setToken(data.token);
      router.replace("/admin/sections");
    } catch {
      setErrorMessage("Nama pengguna atau kata sandi salah");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-brand-teal-soft bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold text-brand-navy">Login Admin</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="admin-username"
          label="Nama Pengguna"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
        <Input
          id="admin-password"
          label="Kata Sandi"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </section>
  );
}
