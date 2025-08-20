'use client'

import React, { useState, useEffect } from "react";
import { ProductType, NewProductType, UpdateProductType } from "@/app/types/product";
import productTypeApi from "@/app/utils/productTypeApi";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";

export default function ProductTypePage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewProductType | UpdateProductType>({
    name: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await productTypeApi.getAll();
      const data = response.data.data || response.data || [];
      if (Array.isArray(data)) setProductTypes(data);
      else setProductTypes([]);
    } catch (err) {
      console.error("Failed to fetch product types:", err);
      toast.error("Không thể tải danh sách loại sản phẩm!");
      setProductTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setFormData({
      name: productType.name
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await productTypeApi.delete(id.toString());
      if (success) {
        setProductTypes(productTypes.filter((pt) => pt.id !== id));
        toast.success("Xóa thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      toast.error("Có lỗi khi xóa!");
    } finally {
      setShowDeleteModal(false);
      setSelectedProductType(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProductType) {
        const success = await productTypeApi.update(selectedProductType.id.toString(), formData as UpdateProductType);
        if (success) {
          await fetchProductTypes();
          toast.success("Cập nhật thành công!");
        }
      } else {
        const newId = await productTypeApi.create(formData as NewProductType);
        if (newId) {
          await fetchProductTypes();
          toast.success("Tạo mới thành công!");
        }
      }
      setIsDialogOpen(false);
      setFormData({ name: ""});
      setSelectedProductType(null);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#B983FF]">
          Quản lý loại sản phẩm
        </h1>
        <button
          onClick={() => {
            setFormData({ name: ""});
            setSelectedProductType(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#B983FF] hover:bg-[#B983FF]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon size={18} className="mr-2" />
          Thêm mới
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-[#94DAFF]/20 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B983FF]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#94DAFF]/10 text-[#94B3FD]">
                  <th className="py-3 px-6 text-left font-medium">Tên</th>
                  <th className="py-3 px-6 text-left font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#94DAFF]/10">
                {productTypes.map((productType) => (
                  <tr key={productType.id} className="hover:bg-[#94DAFF]/5">
                    <td className="py-3 px-6 text-[#94B3FD]">{productType.name}</td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => handleEdit(productType)}
                        className="mr-3 p-2 text-[#94B3FD] hover:text-[#B983FF] hover:bg-[#94DAFF]/10 rounded-lg"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductType(productType);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa/thêm mới loại sản phẩm */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-[#94DAFF]/20">
              <h2 className="text-xl font-bold text-[#B983FF]">
                {selectedProductType ? "Chỉnh sửa" : "Thêm mới"} loại sản phẩm
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Tên loại sản phẩm</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedProductType(null);
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
                Bạn có chắc chắn muốn xóa loại sản phẩm "{selectedProductType?.name}"?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(selectedProductType?.id!)}
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
