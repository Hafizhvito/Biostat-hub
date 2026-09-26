"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Presentation } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface SectionItem {
  id: number;
  name: string;
}

interface PresentationItem {
  id: number;
  title: string;
  description: string;
  originalName: string;
  fileSize: number;
  downloadCount: number;
  sectionId: number;
  section: SectionItem;
}

interface FormState {
  title: string;
  description: string;
  sectionId: string;
}

const emptyForm: FormState = { title: "", description: "", sectionId: "" };

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

export default function AdminPresentationsPage() {
  const [items, setItems] = useState<PresentationItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const authApi = apiWithAuth(getToken() ?? "");

  const sectionOptions = useMemo(
    () => sections.map((section) => ({ value: String(section.id), label: section.name })),
    [sections],
  );

  async function loadData() {
    const [presentationData, sectionData] = await Promise.all([
      authApi<PresentationItem[]>("/admin/downloads?scope=material"),
      authApi<SectionItem[]>("/admin/sections"),
    ]);
    setItems(presentationData);
    setSections(sectionData);
  }

  useEffect(() => {
    loadData()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat PPT materi."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
    const input = document.getElementById("presentation-file") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function handleEdit(item: PresentationItem) {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, sectionId: String(item.sectionId) });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.sectionId) {
      setErrorMessage("Materi wajib dipilih.");
      return;
    }
    if (!editingId && !file) {
      setErrorMessage("File PDF hasil ekspor PPT wajib dipilih.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      if (editingId && !file) {
        await authApi(`/admin/downloads/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ ...form, category: "Materi" }),
        });
      } else {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("category", "Materi");
        formData.append("sectionId", form.sectionId);
        if (file) formData.append("file", file);
        await authApi(editingId ? `/admin/downloads/${editingId}` : "/admin/downloads", {
          method: editingId ? "PUT" : "POST",
          body: formData,
        });
      }
      await loadData();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan PPT materi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/downloads/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus PPT materi.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat PPT materi...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola PPT Materi</h1>
        <p className="text-sm text-gray-600">Unggah PDF hasil ekspor PPT dan hubungkan langsung ke materi yang sesuai.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Judul PPT" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          <Select label="Pilih Materi" options={sectionOptions} value={form.sectionId} onChange={(event) => setForm((prev) => ({ ...prev, sectionId: event.target.value }))} placeholder="Pilih materi" required />
          <Textarea label="Deskripsi" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <div className="space-y-1.5">
            <label htmlFor="presentation-file" className="text-sm font-medium text-brand-navy">
              File PDF dari PPT {editingId ? "(opsional jika tidak diganti)" : ""}
            </label>
            <input
              id="presentation-file"
              type="file"
              accept=".pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">Simpan atau ekspor PPT sebagai PDF terlebih dahulu. Format PDF, maksimal 100 MB.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah PPT"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button> : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-brand-peach/60 p-3 text-brand-warm"><Presentation className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
                  <p className="text-sm font-medium text-brand-teal">Materi: {item.section.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.description || "Deskripsi belum tersedia."}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{item.originalName} · {formatFileSize(item.fileSize)} · {item.downloadCount} unduhan</p>
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
        title="Hapus PPT Materi"
        message="File PPT/PDF akan dihapus permanen. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
