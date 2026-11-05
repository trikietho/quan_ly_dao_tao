import CrudManager from "@/components/CrudManager";

export default function MonHocPage() {
  return (
    <CrudManager
      badgeText="Bài thực hành 3"
      title="Quản lý môn học"
      subtitle="Theo dõi chương trình đào tạo, số tín chỉ và học phần."
      tableName="mon_hoc"
      orderBy="ma_mon"
      fields={[
        { key: "ma_mon", label: "Mã môn", placeholder: "VD: CNTT101" },
        { key: "ten_mon", label: "Tên môn học", placeholder: "VD: Cơ sở dữ liệu" },
        { key: "so_tin_chi", label: "Số tín chỉ", type: "number", placeholder: "3" },
      ]}
    />
  );
}