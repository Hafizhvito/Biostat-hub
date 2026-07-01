"use client";

/** Admin: CRUD materi + urutan ↑↓ + link preview ke website. */

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { getToken } from "@/lib/auth";
import { apiWithAuth } from "@/lib/api";
import { normalizeRichText, stripHtml } from "@/lib/rich-text";

interface SectionItem {
  id: number;
  name: string;
  description: string;
  _count?: {
    videos: number;
  };
}

interface SectionFormState {
  name: string;
  description: string;
}

const initialFormState: SectionFormState = {
  name: "",
  description: "",
};

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<SectionFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SectionFormState>(initialFormState);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadSections() {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await authApi<SectionItem[]>("/admin/sections");
      setSections(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data materi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    try {
      await authApi("/admin/sections", {
        method: "POST",
        body: JSON.stringify({
          ...createForm,
          description: normalizeRichText(createForm.description),
        }),
      });
      setCreateForm(initialFormState);
      setIsCreateOpen(false);
      await loadSections();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menambah materi.");
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(section: SectionItem) {
    setEditingId(section.id);
    setEditForm({
      name: section.name,
      description: section.description ?? "",
    });
    setFormError("");
  }

  async function handleUpdate(sectionId: number) {
    setIsSaving(true);
    setFormError("");
    try {
      await authApi(`/admin/sections/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editForm,
          description: normalizeRichText(editForm.description),
        }),
      });
      setEditingId(null);
      await loadSections();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(sectionId: number) {
    setIsSaving(true);
    setFormError("");
    try {
      await authApi(`/admin/sections/${sectionId}`, { method: "DELETE" });
      setConfirmDeleteId(null);
      await loadSections();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menghapus materi.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReorder(sectionId: number, direction: "up" | "down") {
    setFormError("");
    try {
      await authApi(`/admin/sections/${sectionId}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ direction }),
      });
      await loadSections();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal mengubah urutan materi.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat data materi...</p>;

  if (errorMessage) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Kelola Materi</h1>
          <p className="text-sm text-gray-600">Tambah, ubah, hapus, dan atur urutan materi.</p>
        </div>
        <Button variant={isCreateOpen ? "secondary" : "primary"} onClick={() => setIsCreateOpen((prev) => !prev)}>
          Tambah Materi Baru
        </Button>
      </div>

      {isCreateOpen ? (
        <Card>
          <form className="space-y-3" onSubmit={handleCreate}>
            <Input
              label="Nama Materi"
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <RichTextEditor
              label="Deskripsi"
              value={createForm.description}
              onChange={(description) => setCreateForm((prev) => ({ ...prev, description }))}
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan Materi"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreateForm(initialFormState);
                  setIsCreateOpen(false);
                }}
                disabled={isSaving}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      {sections.length === 0 ? (
        <EmptyState message="Belum ada data. Klik Tambah Baru untuk memulai." />
      ) : (
        <div className="space-y-3">
          {sections.map((section) => {
            const isEditing = editingId === section.id;
            return (
              <Card key={section.id}>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Nama Materi"
                      value={editForm.name}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                    />
                    <RichTextEditor
                      label="Deskripsi"
                      value={editForm.description}
                      onChange={(description) => setEditForm((prev) => ({ ...prev, description }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleUpdate(section.id)} disabled={isSaving}>
                        Simpan
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingId(null)} disabled={isSaving}>
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-brand-navy">{section.name}</h2>
                        <p className="text-sm text-gray-600">
                          {stripHtml(section.description) || "Belum ada deskripsi."}
                        </p>
                        {section._count ? (
                          <p className="mt-1 text-xs text-gray-500">Total video: {section._count.videos}</p>
                        ) : null}
                      </div>
                      <ReorderButtons onReorder={(direction) => handleReorder(section.id, direction)} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => startEdit(section)}>
                        Ubah
                      </Button>
                      <Button variant="danger" onClick={() => setConfirmDeleteId(section.id)}>
                        Hapus
                      </Button>
                      <Link
                        href={`/section/${section.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-brand-teal bg-white px-4 py-2 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal-soft"
                      >
                        Lihat di Website
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Hapus Materi"
        message="Materi yang dihapus tidak dapat dikembalikan. Lanjutkan?"
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
