"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ToolSettings {
  calculatorUrl: string;
}

export default function AdminToolsPage() {
  const [calculatorUrl, setCalculatorUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const authApi = apiWithAuth(getToken() ?? "");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await authApi<ToolSettings>("/admin/settings/calculator-url");
        if (!cancelled) {
          setCalculatorUrl(data.calculatorUrl || "");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Gagal memuat pengaturan alat.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await authApi<ToolSettings>("/admin/settings/calculator-url", {
        method: "PUT",
        body: JSON.stringify({ calculatorUrl }),
      });
      setSuccessMessage("URL kalkulator berhasil disimpan.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan URL kalkulator.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="py-8 text-sm text-gray-500">Memuat pengaturan alat...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan Alat</h1>
        <p className="text-sm text-gray-600">Atur URL kalkulator sampel yang digunakan halaman publik.</p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="URL Kalkulator"
            value={calculatorUrl}
            onChange={(event) => setCalculatorUrl(event.target.value)}
            placeholder="https://..."
          />
          {calculatorUrl ? (
            <p className="text-sm text-gray-600">
              Preview aktif: <span className="font-medium text-brand-navy">{calculatorUrl}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">URL belum diatur.</p>
          )}
          {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan URL"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
