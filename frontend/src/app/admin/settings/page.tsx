"use client";

/** Admin: ubah judul & deskripsi hero beranda. */

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getToken } from "@/lib/auth";
import { apiWithAuth } from "@/lib/api";

interface AdminSettings {
  heroTitle: string;
  heroDescription: string;
  contactEmail: string;
}

const initialSettings: AdminSettings = {
  heroTitle: "",
  heroDescription: "",
  contactEmail: "risethub.support@gmail.com",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const authApi = apiWithAuth(getToken() ?? "");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await authApi<AdminSettings>("/admin/settings");
        if (cancelled) return;
        setSettings(data);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat pengaturan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const data = await authApi<AdminSettings>("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(data);
      setSuccessMessage("Perubahan pengaturan berhasil disimpan.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat pengaturan...</p>;

  if (errorMessage) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan Beranda</h1>
        <p className="text-sm text-gray-600">Kelola tampilan beranda dan alamat email dukungan.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Judul Beranda"
            value={settings.heroTitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, heroTitle: event.target.value }))}
            required
          />
          <Textarea
            label="Deskripsi Beranda"
            value={settings.heroDescription}
            onChange={(event) => setSettings((prev) => ({ ...prev, heroDescription: event.target.value }))}
            required
          />
          <Input
            label="Email Dukungan"
            type="email"
            value={settings.contactEmail}
            onChange={(event) => setSettings((prev) => ({ ...prev, contactEmail: event.target.value }))}
            required
          />
          {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
