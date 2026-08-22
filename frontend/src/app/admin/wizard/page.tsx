"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface WizardItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface FormState {
  title: string;
  description: string;
}

const emptyForm: FormState = { title: "", description: "" };

export default function AdminWizardPage() {
  const [items, setItems] = useState<WizardItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadItems() {
    const data = await authApi<WizardItem[]>("/admin/wizard");
    setItems(data);
  }

  useEffect(() => {
    loadItems()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat wizard."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [items, search]);

  function resetForm() {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
  }

  function handleEdit(item: WizardItem) {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description });
    setImage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      if (editingId && !image) {
        await authApi(`/admin/wizard/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        if (!image) {
          throw new Error("Gambar wajib dipilih.");
        }
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("image", image);
        await authApi(editingId ? `/admin/wizard/${editingId}` : "/admin/wizard", {
          method: editingId ? "PUT" : "POST",
          body: formData,
        });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan wizard.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReorder(id: number, direction: "up" | "down") {
    try {
      await authApi("/admin/wizard/reorder", {
        method: "PUT",
        body: JSON.stringify({ id, direction }),
      });
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengubah urutan.");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/wizard/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus wizard.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat wizard...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Wizard Uji</h1>
        <p className="text-sm text-gray-600">Upload gambar flowchart, atur urutan, dan kelola pembahasan.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Judul" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          <Textarea label="Pembahasan" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-navy">Gambar {editingId ? "(opsional untuk ganti gambar)" : ""}</label>
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : editingId ? "Update Wizard" : "Upload Gambar"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button> : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <Input label="Cari Wizard" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul atau pembahasan..." />

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="space-y-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
                  <p className="whitespace-pre-line text-sm text-gray-700">{item.description || "Pembahasan belum tersedia."}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="danger" onClick={() => setDeleteId(item.id)}>Hapus</Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <ReorderButtons onReorder={(direction) => handleReorder(item.id, direction)} />
                <a href={item.imageUrl} download className="inline-flex items-center gap-2 text-sm font-medium text-brand-warm hover:underline">
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
              <Image src={item.imageUrl} alt={item.title} width={1200} height={800} className="max-h-56 w-full rounded-xl border border-gray-100 object-contain" unoptimized />
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Wizard"
        message="Gambar dan data wizard akan dihapus permanen. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
