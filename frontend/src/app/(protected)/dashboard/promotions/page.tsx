'use client'

import React, { useState, useEffect } from "react";
import { Promotion, NewPromotion, UpdatePromotion } from "@/app/types/product";
import promotionApi from "@/app/utils/promotionApi";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";

const toVietnamTimeInput = (dateString: string | Date | undefined): string => {
  if (!dateString) {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Hàm helper để định dạng chuỗi ngày giờ từ API sang định dạng hiển thị giờ Việt Nam
const formatDateTimeForDisplay = (dateString: string | Date | undefined): string => {
  if (!dateString) {
    return "Không có ngày giờ";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export default function PromotionPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewPromotion | UpdatePromotion>({
    name: "",
    description: null,
    discount_type: "PERCENT",
    discount_value: 0,
    start_date: toVietnamTimeInput(new Date()),
    end_date: toVietnamTimeInput(new Date()),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await promotionApi.getAll();
      const data = response.data.data || response.data || [];
      if (Array.isArray(data)) setPromotions(data);
      else setPromotions([]);
    } catch (err) {
      console.error("Failed to fetch promotions:", err);
      toast.error("Không thể tải danh sách khuyến mãi!");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value,
      // Định dạng ngày giờ từ chuỗi API sang định dạng input
      start_date: toVietnamTimeInput(promotion.start_date),
      end_date: toVietnamTimeInput(promotion.end_date),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPromotionToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promotionToDelete) return;

    try {
      const success = await promotionApi.delete(promotionToDelete);
      if (success) {
        setPromotions(promotions.filter((p) => p.id !== promotionToDelete));
        toast.success("Xóa thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      toast.error("Có lỗi khi xóa!");
    } finally {
      setShowConfirmDialog(false);
      setPromotionToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend: UpdatePromotion = {
        name: formData.name,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        start_date: new Date(formData.start_date as string).toISOString(),
        end_date: new Date(formData.end_date as string).toISOString(),
      };

      if (selectedPromotion) {
        const success = await promotionApi.update(selectedPromotion.id, dataToSend);
        if (success) {
          await fetchPromotions();
          toast.success("Cập nhật thành công!");
        }
      } else {
        const newId = await promotionApi.create(dataToSend as NewPromotion);
        if (newId) {
          await fetchPromotions();
          toast.success("Tạo mới thành công!");
        }
      }
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: null,
        discount_type: "PERCENT",
        discount_value: 0,
        start_date: toVietnamTimeInput(new Date()),
        end_date: toVietnamTimeInput(new Date()),
      });
      setSelectedPromotion(null);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <main className="p-6 flex-1 transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#B983FF]">Quản lý khuyến mãi</h1>
          <button
            onClick={() => {
              setFormData({
                name: "",
                description: null,
                discount_type: "PERCENT",
                discount_value: 0,
                start_date: toVietnamTimeInput(new Date()),
                end_date: toVietnamTimeInput(new Date()),
              });
              setSelectedPromotion(null);
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
                    <th className="py-3 px-6 text-left">Tên</th>
                    <th className="py-3 px-6 text-left">Mô tả</th>
                    <th className="py-3 px-6 text-left">Giá trị</th>
                    <th className="py-3 px-6 text-left">Ngày bắt đầu</th>
                    <th className="py-3 px-6 text-left">Ngày kết thúc</th>
                    <th className="py-3 px-6 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94DAFF]/10">
                  {promotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-[#94DAFF]/5">
                      <td className="py-4 px-6 font-medium text-[#B983FF]">
                        {promotion.name}
                      </td>
                      <td className="py-4 px-6 text-[#94B3FD]">
                        {promotion.description}
                      </td>
                      <td className="py-4 px-6 text-[#94B3FD]">
                        {promotion.discount_type === "PERCENT"
                          ? `${promotion.discount_value}%`
                          : `${promotion.discount_value} VNĐ`}
                      </td>
                      <td className="py-4 px-6 text-[#94B3FD]">
                        {formatDateTimeForDisplay(promotion.start_date)}
                      </td>
                      <td className="py-4 px-6 text-[#94B3FD]">
                        {formatDateTimeForDisplay(promotion.end_date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(promotion)}
                            className="text-[#94B3FD] hover:text-[#B983FF]"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(promotion.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {promotions.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p className="text-[#94B3FD]">
                Không có khuyến mãi nào. Tạo khuyến mãi mới để bắt đầu.
              </p>
            </div>
          )}
        </div>
      </main>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#94DAFF]/20">
              <h2 className="text-xl font-bold text-[#B983FF]">
                {selectedPromotion ? "Chỉnh sửa" : "Thêm mới"} khuyến mãi
              </h2>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedPromotion(null);
                }}
                className="absolute top-4 right-4 text-[#94B3FD] hover:text-[#B983FF] text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-[#94B3FD] mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-[#94B3FD] mb-2">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="discount_type" className="block text-[#94B3FD] mb-2">
                    Loại chiết khấu
                  </label>
                  <select
                    id="discount_type"
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as "PERCENT" | "AMOUNT",
                      })
                    }
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  >
                    <option value="PERCENT">Phần trăm</option>
                    <option value="AMOUNT">Số tiền</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discount_value" className="block text-[#94B3FD] mb-2">
                    Giá trị
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94B3FD]">
                      {formData.discount_type === "PERCENT" ? "%" : "VNĐ"}
                    </span>
                    <input
                      type="text"
                      id="discount_value"
                      value={formData.discount_value || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: Number(e.target.value),
                        })
                      }
                      min="0"
                      step={formData.discount_type === "PERCENT" ? "1" : "0.01"}
                      className="w-full pl-8 pr-12 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="start_date" className="block text-[#94B3FD] mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    id="start_date"
                    value={formData.start_date as string}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-[#94B3FD] mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    id="end_date"
                    value={formData.end_date as string}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-[#94DAFF]/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedPromotion(null);
                  }}
                  className="px-6 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B983FF] hover:bg-[#B983FF]/90 text-white rounded-lg"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#B983FF] mb-4">Xác nhận xóa</h2>
            <p className="text-[#94B3FD] mb-6">Bạn có chắc chắn muốn xóa khuyến mãi này không?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
