"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Presentation } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { apiUrl, apiWithAuth } from "@/lib/api";
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
  allowDownload: boolean;
}

interface FormState {
  title: string;
  description: string;
  sectionId: string;
  allowDownload: boolean;
}

const emptyForm: FormState = { title: "", description: "", sectionId: "", allowDownload: false };

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

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/Failed to fetch|NetworkError|Load failed|koneksi/i.test(message)) {
    return "Koneksi ke server terputus. Periksa internet, lalu coba kembali.";
  }
  return message || "Materi gagal disimpan. Silakan coba kembali.";
}

function uploadWithProgress(path: string, method: "POST" | "PUT", body: FormData, token: string, onProgress: (value: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(method, apiUrl(path));
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      let payload: { error?: string } = {};
      try { payload = request.responseText ? JSON.parse(request.responseText) : {}; } catch { /* respons non-JSON */ }
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(payload.error || `Upload gagal (kode ${request.status}).`));
    });
    request.addEventListener("error", () => reject(new Error("Koneksi ke server terputus saat mengunggah file.")));
    request.addEventListener("abort", () => reject(new Error("Upload dibatalkan.")));
    request.send(body);
  });
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
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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
      .catch((error) => setErrorMessage(friendlyError(error)))
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
    setErrorMessage("");
    setSuccessMessage("");
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, sectionId: String(item.sectionId), allowDownload: item.allowDownload });
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
    if (file && file.size > 100 * 1024 * 1024) {
      setErrorMessage("Ukuran file melebihi batas 100 MB. Kompres PDF atau pilih file yang lebih kecil.");
      return;
    }
    if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Format file tidak didukung. Pilih file PDF hasil ekspor PPT/PPTX.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    setUploadProgress(file ? 0 : null);
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
        formData.append("allowDownload", String(form.allowDownload));
        if (file) formData.append("file", file);
        await uploadWithProgress(
          editingId ? `/admin/downloads/${editingId}` : "/admin/downloads",
          editingId ? "PUT" : "POST",
          formData,
          getToken() ?? "",
          setUploadProgress,
        );
      }
      await loadData();
      setSuccessMessage(editingId ? "Perubahan materi presentasi berhasil disimpan." : "Materi presentasi berhasil ditambahkan.");
      resetForm();
    } catch (error) {
      setErrorMessage(friendlyError(error));
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/downloads/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadData();
      setSuccessMessage("Materi presentasi berhasil dihapus.");
    } catch (error) {
      setErrorMessage(friendlyError(error));
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat materi presentasi...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Presentasi</h1>
        <p className="text-sm text-gray-600">Tambahkan bahan presentasi PDF dan hubungkan ke kategori materi yang sesuai.</p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
        <p className="font-semibold">Sebelum mengunggah</p>
        <p>Jika file masih berupa PPT atau PPTX, pilih <strong>Ekspor atau Simpan sebagai PDF</strong> di PowerPoint terlebih dahulu. File PDF akan dapat dibaca langsung di website.</p>
      </div>

      {successMessage ? <div role="status" className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />{successMessage}</div> : null}
      {errorMessage ? <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />{errorMessage}</div> : null}

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Judul Presentasi" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          <Select label="Pilih Materi" options={sectionOptions} value={form.sectionId} onChange={(event) => setForm((prev) => ({ ...prev, sectionId: event.target.value }))} placeholder="Pilih materi" required />
          <Textarea label="Deskripsi" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-brand-navy">
            <input
              type="checkbox"
              checked={form.allowDownload}
              onChange={(event) => setForm((prev) => ({ ...prev, allowDownload: event.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-brand-warm"
            />
            <span>
              <span className="block font-medium">Izinkan pengguna mengunduh PDF</span>
              <span className="mt-0.5 block text-xs text-gray-500">Jika dimatikan, materi hanya dapat dibaca melalui viewer website.</span>
            </span>
          </label>
          <div className="space-y-1.5">
            <label htmlFor="presentation-file" className="text-sm font-medium text-brand-navy">
              File Presentasi PDF {editingId ? "(opsional jika tidak diganti)" : ""}
            </label>
            <input
              id="presentation-file"
              type="file"
              accept=".pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">Format PDF, maksimal 100 MB. File rusak atau bukan PDF akan ditolak otomatis.</p>
          </div>
          {uploadProgress !== null ? (
            <div className="space-y-1" aria-live="polite">
              <div className="flex justify-between text-xs font-medium text-gray-600"><span>Mengunggah file...</span><span>{uploadProgress}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-warm transition-[width]" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? (uploadProgress !== null ? `Mengunggah ${uploadProgress}%` : "Menyimpan...") : editingId ? "Simpan Perubahan" : "Tambah Presentasi"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button> : null}
          </div>
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
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{item.originalName} · {formatFileSize(item.fileSize)} · {item.downloadCount} unduhan</span>
                <span className={`rounded-full px-2.5 py-1 font-semibold ${item.allowDownload ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>Download {item.allowDownload ? "aktif" : "nonaktif"}</span>
              </div>
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
        title="Hapus Materi Presentasi"
        message="File PDF dan informasi materi akan dihapus permanen. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
