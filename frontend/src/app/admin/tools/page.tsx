"use client";

import { FormEvent, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface CalculatorLinkItem {
  id: number;
  title: string;
  url: string;
}

interface FormState {
  title: string;
  url: string;
}

const emptyForm: FormState = { title: "", url: "" };

export default function AdminToolsPage() {
  const [items, setItems] = useState<CalculatorLinkItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadItems() {
    const data = await authApi<CalculatorLinkItem[]>("/admin/calculator-links");
    setItems(data);
  }

  useEffect(() => {
    loadItems()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat link kalkulator."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSuccessMessage("");
  }

  function handleEdit(item: CalculatorLinkItem) {
    setEditingId(item.id);
    setForm({ title: item.title, url: item.url });
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingId) {
        await authApi(`/admin/calculator-links/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setSuccessMessage("Link kalkulator berhasil diperbarui.");
      } else {
        await authApi("/admin/calculator-links", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setSuccessMessage("Link kalkulator berhasil ditambahkan.");
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan link kalkulator.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/calculator-links/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus link kalkulator.");
    }
  }

  if (loading) {
    return <p className="py-8 text-sm text-gray-500">Memuat pengaturan alat...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Pengaturan Alat</h1>
        <p className="text-sm text-gray-600">Kelola link kalkulator eksternal yang tampil di halaman publik.</p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Judul Kalkulator"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Misal: Kalkulator Regresi"
            required
          />
          <Input
            label="URL Kalkulator"
            value={form.url}
            onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
            placeholder="https://..."
            required
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : editingId ? "Update Link" : "Tambah Link"}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Batal Edit
              </Button>
            ) : null}
          </div>
          {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
            Belum ada link kalkulator.
          </p>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-brand-warm hover:underline"
                  >
                    {item.url}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteId(item.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Link Kalkulator"
        message="Link ini akan dihapus dari halaman publik. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
