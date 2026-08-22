"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  category: string;
  originalName: string;
  fileSize: number;
  downloadCount: number;
}

interface FormState {
  title: string;
  description: string;
  category: string;
}

const emptyForm: FormState = { title: "", description: "", category: "Materi" };
const categoryOptions = ["Materi", "Template", "Panduan SPSS", "Lainnya"].map((value) => ({ value, label: value }));

function formatFileSize(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadItems() {
    const data = await authApi<DownloadItem[]>("/admin/downloads");
    setItems(data);
  }

  useEffect(() => {
    loadItems()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat unduhan."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [items, search]);

  function resetForm() {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
  }

  function handleEdit(item: DownloadItem) {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, category: item.category });
    setFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      if (editingId && !file) {
        await authApi(`/admin/downloads/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("category", form.category);
        if (!file) throw new Error("File wajib dipilih.");
        formData.append("file", file);
        await authApi(editingId ? `/admin/downloads/${editingId}` : "/admin/downloads", {
          method: "POST",
          ...(editingId ? { method: "PUT" } : {}),
          body: formData,
        });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan unduhan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/downloads/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus unduhan.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat unduhan...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Unduhan</h1>
        <p className="text-sm text-gray-600">Upload file, ubah metadata, dan hapus file unduhan.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Judul" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          <Textarea label="Deskripsi" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <Select label="Kategori" options={categoryOptions} value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-navy">File {editingId ? "(opsional untuk ganti file)" : ""}</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp,.gif,.zip"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">
              PDF, Word, PowerPoint, Excel, CSV, TXT, JPG, PNG, WebP, GIF, atau ZIP. Maksimal 100 MB.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : editingId ? "Update Metadata" : "Upload File"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button> : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <Input label="Cari File" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul atau kategori..." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-brand-peach/60 p-3 text-brand-warm">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description || "Deskripsi belum tersedia."}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-brand-warm">
                <span className="rounded-full bg-brand-peach px-3 py-1">{item.category}</span>
                <span className="rounded-full bg-brand-peach px-3 py-1">{formatFileSize(item.fileSize)}</span>
                <span className="rounded-full bg-brand-peach px-3 py-1">{item.downloadCount} unduhan</span>
              </div>
              <p className="text-xs text-gray-500">File asli: {item.originalName}</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="danger" onClick={() => setDeleteId(item.id)}>Hapus</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus File Unduhan"
        message="File dan metadata akan dihapus permanen. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
