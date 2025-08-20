'use client'

import React, { useState, useEffect } from "react";
import { Size, NewSize, UpdateSize, SizeType } from "@/app/types/product";
import sizeApi from "@/app/utils/sizeApi";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";

export default function SizePage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [sizeTypes, setSizeTypes] = useState<SizeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewSize | UpdateSize>({
    value: "",
    size_type_id: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSizes();
    fetchSizeTypes();
  }, []);

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await sizeApi.getAll();
      const data = response.data.data || [];
      if (Array.isArray(data)) setSizes(data);
      else setSizes([]);
    } catch (err) {
      console.error("Failed to fetch sizes:", err);
      toast.error("Không thể tải danh sách kích cỡ!");
      setSizes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSizeTypes = async () => {
    try {
      const response: AxiosResponse<SizeType[]> = await sizeApi.getAllSizeTypes();
      const data = response.data || [];
      if (Array.isArray(data)) setSizeTypes(data);
      else setSizeTypes([]);
    } catch (err) {
      console.error("Failed to fetch size types:", err);
      toast.error("Không thể tải danh sách loại kích cỡ!");
      setSizeTypes([]);
    }
  };

  const handleEdit = (size: Size) => {
    setSelectedSize(size);
    setFormData({
      value: size.value,
      size_type_id: size.size_type_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await sizeApi.delete(id);
      if (success) {
        setSizes(sizes.filter((s) => s.id !== id));
        toast.success("Xóa thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      toast.error("Có lỗi khi xóa!");
    } finally {
      setShowDeleteModal(false);
      setSelectedSize(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSize) {
        const success = await sizeApi.update(selectedSize.id, formData as UpdateSize);
        if (success) {
          await fetchSizes();
          toast.success("Cập nhật thành công!");
        }
      } else {
        const newId = await sizeApi.create(formData as NewSize);
        if (newId) {
          await fetchSizes();
          toast.success("Tạo mới thành công!");
        }
      }
      setIsDialogOpen(false);
      setFormData({ value: "", size_type_id: 0 });
      setSelectedSize(null);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const groupedSizes = sizes.reduce((acc, size) => {
    const sizeType = size.size_type_name || "Chưa chọn";
    if (!acc[sizeType]) {
      acc[sizeType] = [];
    }
    acc[sizeType].push(size);
    return acc;
  }, {} as { [key: string]: Size[] });

  return (
    <div className="p-6 bg-white min-h-screen">
      <main>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#B983FF]">
            Quản lý kích cỡ
          </h1>
          <button
            onClick={() => {
              setFormData({ value: "", size_type_id: 0 });
              setSelectedSize(null);
              setIsDialogOpen(true);
            }}
            className="bg-[#B983FF] hover:bg-[#B983FF]/90 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusIcon size={18} className="mr-2" />
            Thêm mới
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B983FF]"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSizes).map(([sizeTypeName, sizesInGroup]) => (
              <div key={sizeTypeName}>
                <h2 className="text-lg mb-2 text-[#B983FF]">{sizeTypeName}</h2>
                <div className="flex flex-wrap gap-4">
                  {sizesInGroup.map((size) => (
                    <div
                      key={size.id}
                      className="bg-white p-3 rounded-lg shadow-md border border-[#94DAFF]/50 flex items-center justify-between min-h-[60px]"
                    >
                      <h3 className="text-lg font-bold text-[#94B3FD]">{size.value}</h3>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(size)}
                          className="text-[#94B3FD] hover:text-[#B983FF]"
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(size.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal chỉnh sửa/thêm mới kích cỡ */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-[#94DAFF]/20">
              <h2 className="text-xl font-bold text-[#B983FF]">
                {selectedSize ? "Chỉnh sửa" : "Thêm mới"} kích cỡ
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Kích cỡ</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Loại kích cỡ</label>
                <select
                  value={formData.size_type_id}
                  onChange={(e) => setFormData({ ...formData, size_type_id: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                  required
                >
                  <option value={0}>Chưa chọn</option>
                  {sizeTypes.map((sizeType) => (
                    <option key={sizeType.id} value={sizeType.id}>
                      {sizeType.name} ({sizeType.type_code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedSize(null);
                  }}
                  className="px-4 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B983FF] hover:bg-[#B983FF]/90 text-white rounded-lg"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#B983FF] mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-[#94B3FD] mb-6">
                Bạn có chắc chắn muốn xóa kích cỡ "{selectedSize?.value}"?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(selectedSize?.id!)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};