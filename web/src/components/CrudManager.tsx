"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export interface FieldConfig {
  key: string;           // Tên cột trong bảng Supabase (VD: 'ma_mon')
  label: string;         // Tên hiển thị trên web (VD: 'Mã môn')
  type?: "text" | "number" | "email" | "date";
  placeholder?: string;
}

interface CrudManagerProps {
  title: string;         // Tiêu đề trang
  subtitle: string;      // Mô tả ngắn
  badgeText: string;     // Nhãn bài thực hành (VD: 'Bài thực hành 3')
  tableName: string;     // Tên bảng trong Supabase (VD: 'mon_hoc')
  orderBy: string;       // Cột dùng để sắp xếp
  fields: FieldConfig[]; // Cấu hình các cột
}

export default function CrudManager({
  title,
  subtitle,
  badgeText,
  tableName,
  orderBy,
  fields,
}: CrudManagerProps) {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  // Khởi tạo giá trị mặc định cho form
  const initForm = () => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.key] = f.type === "number" ? 0 : "";
    });
    setFormData(initial);
    setEditingId(null);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order(orderBy, { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    initForm();
    fetchData();
  }, [tableName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Chuẩn hóa dữ liệu số trước khi lưu
    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      payload[f.key] =
        f.type === "number" ? Number(formData[f.key]) : formData[f.key];
    });

    const { error } =
      editingId === null
        ? await supabase.from(tableName).insert([payload])
        : await supabase.from(tableName).update(payload).eq("id", editingId);

    if (error) {
      setError(error.message);
    } else {
      initForm();
      await fetchData();
    }
    setSubmitting(false);
  };

  const handleEdit = (item: Record<string, any>) => {
    setEditingId(item.id);
    const editData: Record<string, any> = {};
    fields.forEach((f) => {
      editData[f.key] = item[f.key];
    });
    setFormData(editData);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này không?")) return;

    setError(null);
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      if (editingId === id) initForm();
      await fetchData();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">Quản lý đào tạo</span>
          <nav className="flex gap-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Trang chủ
            </Link>
            <Link href="/hoc-vien" className="hover:text-slate-900">
              Học viên
            </Link>
            <Link href="/mon-hoc" className="hover:text-slate-900">
              Môn học
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
              {badgeText}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">
            Tổng số: {items.length}
          </span>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Lỗi thao tác: {error}
          </div>
        )}

        {/* Form tự động sinh theo cấu hình fields */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-base font-semibold text-slate-900">
            {editingId === null ? "Thêm mới" : "Cập nhật thông tin"}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-700">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  required
                  placeholder={field.placeholder || ""}
                  value={formData[field.key] ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {submitting
                ? "Đang lưu..."
                : editingId === null
                ? "Thêm mới"
                : "Lưu thay đổi"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={initForm}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Bảng tự động sinh các cột theo cấu hình fields */}
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-medium text-slate-700">
              <tr>
                {fields.map((f) => (
                  <th key={f.key} className="px-6 py-3.5">
                    {f.label}
                  </th>
                ))}
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Chưa có dữ liệu.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    {fields.map((f, idx) => (
                      <td
                        key={f.key}
                        className={`px-6 py-4 ${
                          idx === 0
                            ? "font-mono font-medium text-teal-700"
                            : "text-slate-900"
                        }`}
                      >
                        {item[f.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="font-medium text-teal-700 hover:text-teal-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}