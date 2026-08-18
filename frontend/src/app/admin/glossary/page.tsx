"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface GlossaryItem {
  id: number;
  term: string;
  definition: string;
  example: string | null;
}

interface FormState {
  term: string;
  definition: string;
  example: string;
}

const emptyForm: FormState = { term: "", definition: "", example: "" };

export default function AdminGlossaryPage() {
  const [items, setItems] = useState<GlossaryItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadItems() {
    const data = await authApi<GlossaryItem[]>("/admin/glossary");
    setItems(data);
  }

  useEffect(() => {
    loadItems()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat glosarium."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q));
  }, [items, search]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(item: GlossaryItem) {
    setEditingId(item.id);
    setForm({ term: item.term, definition: item.definition, example: item.example ?? "" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        term: form.term,
        definition: form.definition,
        example: form.example,
      };

      if (editingId) {
        await authApi<GlossaryItem>(`/admin/glossary/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await authApi<GlossaryItem>("/admin/glossary", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan istilah.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setErrorMessage("");
    try {
      await authApi(`/admin/glossary/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus istilah.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat glosarium...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Glosarium</h1>
        <p className="text-sm text-gray-600">Tambah, ubah, dan hapus istilah riset.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Istilah" value={form.term} onChange={(event) => setForm((prev) => ({ ...prev, term: event.target.value }))} required />
          <Textarea label="Definisi" value={form.definition} onChange={(event) => setForm((prev) => ({ ...prev, definition: event.target.value }))} required />
          <Textarea label="Contoh Penggunaan (opsional)" value={form.example} onChange={(event) => setForm((prev) => ({ ...prev, example: event.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : editingId ? "Update Istilah" : "Tambah Istilah"}</Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button>
            ) : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <Input label="Cari Istilah" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari glosarium..." />

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">{item.term}</h2>
                  <p className="mt-1 text-sm text-gray-700">{item.definition}</p>
                  {item.example ? <p className="mt-2 text-sm text-brand-warm">Contoh: {item.example}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="danger" onClick={() => setDeleteId(item.id)}>Hapus</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Istilah"
        message="Istilah yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
