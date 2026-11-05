const modules = [
  {
    title: "Học viên",
    desc: "Quản lý hồ sơ, lớp học và kết quả học tập.",
    status: "Bài 2",
  },
  {
    title: "Môn học",
    desc: "Theo dõi chương trình đào tạo, số tín chỉ và học phần.",
    status: "Bài 3",
  },
  {
    title: "Tuyển sinh",
    desc: "Tiếp nhận hồ sơ và theo dõi tiến độ xét tuyển.",
    status: "Bài 4",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">Quản lý đào tạo</span>
          <nav className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="font-medium text-slate-900">
              Trang chủ
            </a>
            <a href="#" className="hover:text-slate-900">
              Học viên
            </a>
            <a href="/mon-hoc" className="hover:text-slate-900">
              Môn học
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Bài thực hành 1
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Hệ thống quản lý đào tạo
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Ứng dụng web đầu tiên được viết bằng Next.js, chạy trên trình duyệt
          và đưa lên mạng bằng Vercel.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#"
            className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            Bắt đầu
          </a>
          <a
            href="#"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-100"
          >
            Xem hướng dẫn
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-xl font-semibold">Các chức năng</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.title}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
              <span className="mt-4 inline-block rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 Bài thực hành Next.js
      </footer>
    </main>
  );
}