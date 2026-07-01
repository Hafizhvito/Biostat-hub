"use client";

/** Admin: CRUD video + filter per materi + urutan ↑↓. */

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getToken } from "@/lib/auth";
import { apiWithAuth } from "@/lib/api";
import { normalizeRichText, stripHtml } from "@/lib/rich-text";

interface SectionItem {
  id: number;
  name: string;
}

interface VideoItem {
  id: number;
  sectionId: number;
  title: string;
  youtubeUrl: string;
  description: string;
  section: {
    id: number;
    name: string;
  };
}

interface VideoFormState {
  title: string;
  youtubeUrl: string;
  sectionId: string;
  description: string;
}

const initialFormState: VideoFormState = {
  title: "",
  youtubeUrl: "",
  sectionId: "",
  description: "",
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>("all");
  const [form, setForm] = useState<VideoFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  const sectionOptions = useMemo(
    () => sections.map((section) => ({ value: String(section.id), label: section.name })),
    [sections],
  );

  const filteredVideos = useMemo(() => {
    if (selectedSectionFilter === "all") return videos;
    return videos.filter((video) => String(video.sectionId) === selectedSectionFilter);
  }, [selectedSectionFilter, videos]);

  async function loadData() {
    setLoading(true);
    setErrorMessage("");
    try {
      const [sectionData, videoData] = await Promise.all([
        authApi<SectionItem[]>("/admin/sections"),
        authApi<VideoItem[]>("/admin/videos"),
      ]);
      setSections(sectionData);
      setVideos(videoData);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data video.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function normalizeError(error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    if (message.toLowerCase().includes("youtube")) {
      setYoutubeError(message);
    } else {
      setFormError(message);
    }
  }

  function resetForm() {
    setForm(initialFormState);
    setEditingId(null);
    setFormError("");
    setYoutubeError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.sectionId) {
      setFormError("Silakan pilih materi terlebih dahulu.");
      return;
    }

    setIsSaving(true);
    setFormError("");
    setYoutubeError("");

    const payload = {
      title: form.title,
      youtubeUrl: form.youtubeUrl,
      sectionId: Number(form.sectionId),
      description: normalizeRichText(form.description),
    };

    try {
      if (editingId === null) {
        await authApi("/admin/videos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await authApi(`/admin/videos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await loadData();
    } catch (error) {
      normalizeError(error);
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(video: VideoItem) {
    setEditingId(video.id);
    setForm({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      sectionId: String(video.sectionId),
      description: video.description ?? "",
    });
    setFormError("");
    setYoutubeError("");
  }

  async function handleDelete(videoId: number) {
    setIsSaving(true);
    setFormError("");
    try {
      await authApi(`/admin/videos/${videoId}`, { method: "DELETE" });
      setConfirmDeleteId(null);
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menghapus video.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReorder(videoId: number, direction: "up" | "down") {
    setFormError("");
    try {
      await authApi(`/admin/videos/${videoId}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ direction }),
      });
      await loadData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal mengubah urutan video.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat data video...</p>;
  if (errorMessage) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Video</h1>
        <p className="text-sm text-gray-600">Tambah, ubah, hapus, dan atur urutan video per materi.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Judul Video"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <Input
            label="Link YouTube"
            value={form.youtubeUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, youtubeUrl: event.target.value }))}
            error={youtubeError || undefined}
            required
          />
          <Select
            label="Pilih Materi"
            options={sectionOptions}
            value={form.sectionId}
            onChange={(event) => setForm((prev) => ({ ...prev, sectionId: event.target.value }))}
            placeholder="Pilih materi"
            required
          />
          <RichTextEditor
            label="Deskripsi"
            value={form.description}
            onChange={(description) => setForm((prev) => ({ ...prev, description }))}
          />
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : editingId === null ? "Tambah Video" : "Simpan Perubahan"}
            </Button>
            {editingId !== null ? (
              <Button variant="secondary" onClick={resetForm} disabled={isSaving}>
                Batal
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card>
        <Select
          label="Filter berdasarkan materi"
          options={[{ value: "all", label: "Semua Materi" }, ...sectionOptions]}
          value={selectedSectionFilter}
          onChange={(event) => setSelectedSectionFilter(event.target.value)}
        />
      </Card>

      {filteredVideos.length === 0 ? (
        <EmptyState message="Belum ada data video. Silakan tambahkan video baru." />
      ) : (
        <div className="space-y-3">
          {filteredVideos.map((video) => (
            <Card key={video.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">{video.title}</h2>
                  <p className="text-sm text-gray-600">Materi: {video.section.name}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {stripHtml(video.description) || "Belum ada deskripsi."}
                  </p>
                </div>
                <ReorderButtons onReorder={(direction) => handleReorder(video.id, direction)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => startEdit(video)}>
                  Ubah
                </Button>
                <Button variant="danger" onClick={() => setConfirmDeleteId(video.id)}>
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Hapus Video"
        message="Video yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId !== null) {
            void handleDelete(confirmDeleteId);
          }
        }}
      />
    </div>
  );
}
