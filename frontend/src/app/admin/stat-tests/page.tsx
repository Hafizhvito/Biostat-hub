"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { apiWithAuth } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface StatTestItem {
  id: number;
  name: string;
  function: string;
  dataType: string;
  dataDistribution: string;
  useCase: string;
  spssMenu: string;
  notes: string;
}

interface FormState {
  name: string;
  function: string;
  dataType: string;
  dataDistribution: string;
  useCase: string;
  spssMenu: string;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  function: "",
  dataType: "nominal",
  dataDistribution: "parametrik",
  useCase: "",
  spssMenu: "",
  notes: "",
};

const typeOptions = ["nominal", "ordinal", "interval", "rasio"].map((value) => ({ value, label: value }));
const distributionOptions = ["parametrik", "non-parametrik"].map((value) => ({ value, label: value }));

export default function AdminStatTestsPage() {
  const [items, setItems] = useState<StatTestItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const authApi = apiWithAuth(getToken() ?? "");

  async function loadItems() {
    const data = await authApi<StatTestItem[]>("/admin/stat-tests");
    setItems(data);
  }

  useEffect(() => {
    loadItems()
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Gagal memuat tabel uji."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q) || item.function.toLowerCase().includes(q));
  }, [items, search]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(item: StatTestItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      function: item.function,
      dataType: item.dataType,
      dataDistribution: item.dataDistribution,
      useCase: item.useCase,
      spssMenu: item.spssMenu,
      notes: item.notes,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const payload = { ...form };
      if (editingId) {
        await authApi(`/admin/stat-tests/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await authApi("/admin/stat-tests", { method: "POST", body: JSON.stringify(payload) });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan data uji.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await authApi(`/admin/stat-tests/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await loadItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus data uji.");
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat tabel uji...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Tabel Uji</h1>
        <p className="text-sm text-gray-600">Tambah dan atur ringkasan uji statistik.</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Nama Uji" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
          <Textarea label="Fungsi" value={form.function} onChange={(event) => setForm((prev) => ({ ...prev, function: event.target.value }))} required />
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Jenis Data" options={typeOptions} value={form.dataType} onChange={(event) => setForm((prev) => ({ ...prev, dataType: event.target.value }))} />
            <Select label="Distribusi" options={distributionOptions} value={form.dataDistribution} onChange={(event) => setForm((prev) => ({ ...prev, dataDistribution: event.target.value }))} />
          </div>
          <Textarea label="Kapan Digunakan" value={form.useCase} onChange={(event) => setForm((prev) => ({ ...prev, useCase: event.target.value }))} required />
          <Input label="Menu SPSS" value={form.spssMenu} onChange={(event) => setForm((prev) => ({ ...prev, spssMenu: event.target.value }))} required />
          <Textarea label="Catatan (opsional)" value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : editingId ? "Update Uji" : "Tambah Uji"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Batal Edit</Button> : null}
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>
      </Card>

      <Input label="Cari Uji" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama uji..." />

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-brand-navy">{item.name}</h2>
                <p className="text-sm text-gray-700">{item.function}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-warm">{item.dataType} · {item.dataDistribution}</p>
                <p className="text-sm text-gray-600">{item.useCase}</p>
                <p className="text-sm text-gray-600">SPSS: {item.spssMenu}</p>
                {item.notes ? <p className="text-sm text-gray-500">{item.notes}</p> : null}
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
        title="Hapus Data Uji"
        message="Data uji yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
