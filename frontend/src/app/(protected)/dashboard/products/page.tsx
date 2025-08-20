'use client'

import React, { useState, useEffect } from "react";
import {
  Product,
  NewProduct,
  UpdateProduct,
  NewProductImage,
  NewProductSize,
  GenderType,
  ProductSize,
  Size,
  ProductType,
  SizeType,
  Promotion,
  Category,
} from "@/app/types/product";
import productApi from "@/app/utils/productApi";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react";
import categoryApi from "@/app/utils/categoryApi";
import promotionApi from "@/app/utils/promotionApi";
import productTypeApi from "@/app/utils/productTypeApi";
import productSizeApi from "@/app/utils/productSizeApi";
import sizeApi from "@/app/utils/sizeApi";
import sizeTypeApi from "@/app/utils/sizeTypeApi";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [sizeTypes, setSizeTypes] = useState<SizeType[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewProduct | UpdateProduct>({
    name: "",
    description: null,
    price: 0,
    discount_price: null,
    brand: null,
    color: null,
    material: null,
    gender: null,
    is_best_seller: false,
    is_visible: true,
    category_id: null,
    product_type_id: null,
    images: [],
    sizes: [],
    promotions: [],
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [localImages, setLocalImages] = useState<{ file?: File; previewUrl: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchSizeTypes();
    fetchSizes();
    fetchProductSizes();
    fetchPromotions();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await productApi.getAll();
      const data =  response.data.data || [];
      if (Array.isArray(data)) setProducts(data);
      else setProducts([]);
    } catch (err) {
      console.error("Không thể tải danh sách sản phẩm:", err);
      toast.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchSizeTypes = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await sizeTypeApi.getAll();
      const data = response.data.data || response.data || [];
      if (Array.isArray(data)) setSizeTypes(data);
      else setSizeTypes([]);
    } catch (err) {
      console.error("Failed to fetch size types:", err);
      toast.error("Không thể tải danh sách loại kích cỡ!");
      setSizeTypes([]);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchProductSizes = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse<any> = await productSizeApi.getAll();
        const data = response.data.data || [];
        if (Array.isArray(data)) setProductSizes(data);
        else setProductSizes([]);
      } catch (err) {
        console.error("Failed to fetch product sizes:", err);
        toast.error("Không thể tải danh sách kích cỡ sản phẩm!");
        setProductSizes([]);
      } finally {
        setLoading(false);
      }
    };

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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await categoryApi.getAll();
      const data = response.data.data || response.data || [];
      if (Array.isArray(data)) setCategories(data);
      else setCategories([]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Không thể tải danh sách danh mục!");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      brand: product.brand,
      color: product.color,
      material: product.material,
      gender: product.gender,
      is_best_seller: product.is_best_seller,
      is_visible: product.is_visible,
      category_id: product.category_id,
      product_type_id: product.product_type_id,
      images: product.images.map(img => ({ ...img, product_id: product.id })),
      sizes: product.sizes.map(size => ({ ...size, product_id: product.id, size_id: size.size_id })),
      promotions: product.promotions.map(promo => ({ product_id: product.id, promotion_id: promo.id })),
    });
    // Khởi tạo localImages với các ảnh hiện có từ sản phẩm
    setLocalImages(product.images.map(img => ({
      previewUrl: img.image_url || "/placeholder-image.jpg",
    })));
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setSelectedProduct(products.find(p => p.id === id) || null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        const success = await productApi.delete(selectedProduct.id);
        if (success) {
          setProducts(products.filter((p) => p.id !== selectedProduct.id));
          toast.success("Xóa thành công!");
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        toast.error("Có lỗi khi xóa!");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images ?? []), { product_id: "", image_url: "", is_thumbnail: false }],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, i) => i !== index),
    }));
    setLocalImages((prev) => prev.filter((_, i) => i !== index)); // Xóa local image nếu có
  };

  const handleImageChange = (index: number, field: keyof NewProductImage, value: string | boolean) => {
    setFormData((prev) => {
      const updatedImages = [...(prev.images ?? [])];

      if (field === 'is_thumbnail' && value === true) {
        const thumbnailCount = updatedImages.filter(img => img.is_thumbnail).length;

        // Nếu đã có một thumbnail, ngăn chặn đặt thêm và hiển thị thông báo
        if (thumbnailCount >= 1) {
          toast.error('Một sản phẩm chỉ được có 1 ảnh chính!', { id: 'thumbnail-error' });
          return prev; 
        }
      }

      updatedImages[index] = { ...updatedImages[index], [field]: value };

      return { ...prev, images: updatedImages };
    });
  };

  const handleAddSize = () => {
    setFormData({
      ...formData,
      sizes: [...(formData.sizes || []), { product_id: "", size_id: 0, stock: 0 }],
    });
  };

  const handleRemoveSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: (formData.sizes || []).filter((_, i) => i !== index),
    });
  };

  const handleSizeChange = (index: number, field: keyof NewProductSize, value: number | string) => {
    const updatedSizes = [...(formData.sizes || [])];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleAddPromotion = () => {
    setFormData(prev => ({
      ...prev,
      promotions: [...(prev.promotions ?? []), { product_id: "", promotion_id: "" }],
    }));
  };

  const handleRemovePromotion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      promotions: (prev.promotions ?? []).filter((_, i) => i !== index),
    }));
  };

  const handlePromotionChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedPromotions = [...(prev.promotions ?? [])];
      updatedPromotions[index] = { ...updatedPromotions[index], promotion_id: value };
      return { ...prev, promotions: updatedPromotions };
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value) || 0;
    if (newPrice > 1_000_000_000) {
      toast.error("Giá sản phẩm phải nhỏ hơn 1 tỷ VNĐ!", { id: "price-error" });
      return; // Không cập nhật giá nếu vượt quá giới hạn
    }
    setFormData(prev => ({
      ...prev,
      price: newPrice,
    }));
  };

  const handleImageUpload = async (files: File[]) => {
    const uploadedImages: NewProductImage[] = [];
    const resizeParams = 'w_1200,h_1200,c_scale,q_auto,e_sharpen';

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');
      formData.append('folder', process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || '');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        const imageUrl = response.data.secure_url;

        const resizedImageUrl = imageUrl.replace(
          '/upload/',
          `/upload/${resizeParams}/`
        );

        uploadedImages.push({
          product_id: "",
          image_url: resizedImageUrl
        });
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        toast.error('Có lỗi khi upload ảnh!');
        return;
      }
    }
    return uploadedImages;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newLocalImages = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setLocalImages((prev) => [...prev, ...newLocalImages]);

      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images ?? []),
          ...newLocalImages.map(() => ({ product_id: "", image_url: "", is_thumbnail: false })),
        ],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.price > 1_000_000_000) {
      toast.error("Giá sản phẩm phải nhỏ hơn 1 tỷ VNĐ!", { id: "price-error" });
      setIsSubmitting(false);
      return;
    }

    try {
      let finalFormData = { ...formData };

      if (localImages.some(img => img.file)) {
        const filesToUpload = localImages.filter(img => img.file).map(img => img.file!);
        const uploadedImages = await handleImageUpload(filesToUpload);
        if (!uploadedImages || uploadedImages.length !== filesToUpload.length) {
          toast.error("Lỗi tải lên ảnh!");
          setIsSubmitting(false);
          return;
        }

        let uploadIndex = 0;
        finalFormData = {
          ...finalFormData,
          images: finalFormData.images.map((img, index) => {
            if (localImages[index]?.file) {
              return {
                ...img,
                image_url: uploadedImages[uploadIndex++]?.image_url || img.image_url,
              };
            }
            return img;
          }),
        };
      }

      if (selectedProduct) {
        const success = await productApi.update(selectedProduct.id, finalFormData as UpdateProduct);
        if (success) {
          await fetchProducts();
          await fetchProductSizes();
          toast.success("Cập nhật thành công!");
        }
      } else {
        const newId = await productApi.create(finalFormData as NewProduct);
        if (newId) {
          await fetchProducts();
          await fetchProductSizes();
          toast.success("Tạo mới thành công!");
        }
      }

      setIsEditDialogOpen(false);
      setFormData({
        name: "",
        description: null,
        price: 0,
        discount_price: null,
        brand: null,
        color: null,
        material: null,
        gender: null,
        is_best_seller: false,
        is_visible: true,
        category_id: null,
        product_type_id: null,
        images: [],
        sizes: [],
        promotions: [],
      });
      localImages.forEach((img) => {
        if (img.previewUrl && img.file) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      setLocalImages([]);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.map(product => ({
    ...product,
    sizes: productSizes.filter(ps => ps.product_id === product.id),
  })).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category_id === Number(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex">
      <main className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#B983FF]">Quản lý sản phẩm</h1>
          <button
            onClick={() => {
              setFormData({
                name: "",
                description: null,
                price: 0,
                discount_price: null,
                brand: null,
                color: null,
                material: null,
                gender: null,
                is_best_seller: false,
                is_visible: true,
                category_id: null,
                product_type_id: null,
                images: [],
                sizes: [],
                promotions: [],
              });
              setSelectedProduct(null);
              setIsEditDialogOpen(true);
            }}
            className="bg-[#B983FF] hover:bg-[#B983FF]/90 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusIcon size={18} className="mr-2" />
            Thêm mới
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#94DAFF]/20 overflow-hidden">
          <div className="p-4 border-b border-[#94DAFF]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center bg-[#94DAFF]/10 rounded-lg px-3 py-2 w-full md:w-80">
              <SearchIcon size={18} className="text-[#94B3FD] mr-2" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[#B983FF] placeholder-[#94B3FD] w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="category-filter" className="text-[#94B3FD] mr-2">
                  Danh mục:
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#94DAFF]/10 border-none rounded-lg px-3 py-2 text-[#B983FF] outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
                    <th className="py-3 px-6 text-left">Giá</th>
                    <th className="py-3 px-6 text-left">Thương hiệu</th>
                    <th className="py-3 px-6 text-left">Loại sản phẩm</th>
                    <th className="py-3 px-6 text-left">Kích cỡ</th>
                    <th className="py-3 px-6 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94DAFF]/10">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#94DAFF]/5">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={product.images?.[0]?.image_url || "/placeholder-image.jpg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-[#B983FF]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {product.discount_price ? (
                          <div>
                            <span className="text-[#B983FF] font-medium">
                              {product.discount_price.toLocaleString('vi-VN')}₫
                            </span>
                            <span className="text-[#94B3FD] line-through text-sm ml-2">
                              {product.price.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#B983FF] font-medium">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[#94B3FD]">{product.brand || "Chưa có"}</td>
                      <td className="py-4 px-6 text-[#94B3FD]">{product.product_type_name || "Chưa có"}</td>
                      <td className="py-4 px-4">
                        {product.sizes.length > 0 ? (
                          <table className="w-full border-collapse">
                            <tbody>
                              {product.sizes.map((size, idx) => (
                                <tr key={idx} className="border-b border-[#94DAFF]/20">
                                  <td className="py-2 px-2 text-[#B983FF]">
                                    {size.size_value || "Không xác định"}
                                  </td>
                                  <td className="py-2 px-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        size.stock > 10
                                          ? 'bg-green-100 text-green-800'
                                          : size.stock > 5
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      Còn {size.stock || 0}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <span className="text-[#94B3FD]">Không có kích cỡ</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-[#94B3FD] hover:text-[#B983FF]"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
          {filteredProducts.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p className="text-[#94B3FD]">
                Không tìm thấy sản phẩm. Hãy thử điều chỉnh tìm kiếm của bạn.
              </p>
            </div>
          )}
        </div>
      </main>
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#94DAFF]/20">
              <h2 className="text-xl font-bold text-[#B983FF]">
                {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B983FF]"></div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-[#94B3FD] mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-[#94B3FD] mb-2">
                    Danh mục
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category_id || ""}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-[#94B3FD] mb-2">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="price" className="block text-[#94B3FD] mb-2">
                    Giá
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price || 0}
                      onChange={handlePriceChange}
                      min="0"
                      step="1000"
                      className="w-full pr-8 pl-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]">
                      VNĐ
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="discount_price" className="block text-[#94B3FD] mb-2">
                    Giá giảm (Tùy chọn)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discount_price"
                      name="discount_price"
                      value={formData.discount_price || ""}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? Number(e.target.value) : null })}
                      min="0"
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                      disabled
                    />                    
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]">
                      VNĐ
                    </span>
                  </div>
                </div>                
              </div>
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Khuyến mãi</label>
                <button
                  type="button"
                  onClick={handleAddPromotion}
                  className="px-4 py-2 bg-[#B983FF] hover:bg-[#B983FF]/90 text-white rounded-lg mb-2"
                >
                  Thêm khuyến mãi
                </button>
                {(formData.promotions ?? []).map((promo, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <select
                      value={promo.promotion_id || ""}
                      onChange={(e) => handlePromotionChange(index, e.target.value)}
                      className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    >
                      <option value="">Chọn khuyến mãi</option>
                      {promotions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemovePromotion(index)}
                      className="px-2 py-1 bg-red-400 hover:bg-red-600 text-white rounded-lg"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="brand" className="block text-[#94B3FD] mb-2">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand || ""}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value || null })}
                    className="w-full px-4 py-2 border bg-white text-black border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                  />
                </div>
                <div>
                  <label htmlFor="color" className="block text-[#94B3FD] mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color || ""}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value || null })}
                    className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="material" className="block text-[#94B3FD] mb-2">
                  Chất liệu
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material || ""}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value || null })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="gender" className="block text-[#94B3FD] mb-2">
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={(e) => setFormData({ ...formData, gender: (e.target.value as GenderType) || null })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="product_type_id" className="block text-[#94B3FD] mb-2">
                  Loại sản phẩm
                </label>
                <select
                  id="product_type_id"
                  name="product_type_id"
                  value={formData.product_type_id || ""}
                  onChange={(e) => setFormData({ ...formData, product_type_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-[#94B3FD]">Bán chạy</label>
                <input
                  type="checkbox"
                  checked={formData.is_best_seller}
                  onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                  className="custom-checkbox"
                />
                <label className="text-[#94B3FD] ml-4">Hiển thị</label>
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="custom-checkbox"
                />
              </div>              
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Hình ảnh</label>
                <div className="border border-dashed border-[#94DAFF]/50 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="product-images"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer text-[#94B3FD] hover:text-[#B983FF]"
                  >
                    <div className="w-12 h-12 bg-[#94DAFF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <PlusIcon size={24} />
                    </div>
                    <p>Click để tải lên hình ảnh</p>
                    <p className="text-xs mt-1">PNG, JPG, GIF tối đa 5MB</p>
                  </label>
                </div>
                {(formData.images ?? []).map((image, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={localImages[index]?.previewUrl || image.image_url || "/placeholder-image.jpg"} // Ưu tiên preview local nếu có
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={image.image_url || ""} 
                    onChange={(e) => handleImageChange(index, "image_url", e.target.value)}
                    placeholder="URL hình ảnh"
                    className="flex-1 px-4 py-2 text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                    disabled
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={image.is_thumbnail ?? false}
                      onChange={(e) => handleImageChange(index, "is_thumbnail", e.target.checked)}
                      className="custom-checkbox"
                    />
                    <label className="text-[#94B3FD]">Ảnh chính</label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveImage(index);
                      setLocalImages((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="px-2 py-1 bg-red-400 hover:bg-red-600 text-white rounded-lg"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
              </div>
              <div className="mb-6">
                <label className="block text-[#94B3FD] mb-2">Kích cỡ</label>
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-4 py-2 bg-[#B983FF] hover:bg-[#B983FF]/90 text-white rounded-lg mb-2"
                >
                  Thêm kích cỡ
                </button>
                {(formData.sizes || []).map((size, index) => {
                  const currentSize = sizes.find(s => s.id === size.size_id);
                  const selectedSizeTypeId = currentSize ? currentSize.size_type_id : null;
                  const filteredSizes = selectedSizeTypeId ? sizes.filter(s => s.size_type_id === selectedSizeTypeId) : sizes;

                  return (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      {currentSize ? (
                        <>
                          <input
                            type="text"
                            value={currentSize.value}
                            onChange={(e) => {
                              const newSize = sizes.find(s => s.value === e.target.value);
                              if (newSize) handleSizeChange(index, "size_id", newSize.id);
                            }}
                            className="w-40 px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                            placeholder="Kích cỡ"
                          />
                          <input
                            type="text"
                            value={size.stock || 0}
                            onChange={(e) => handleSizeChange(index, "stock", Number(e.target.value) || 0)}
                            className="w-24 px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                            min="0"
                            placeholder="Số lượng"
                          />
                        </>
                      ) : (
                        <>
                          <select
                            value={selectedSizeTypeId || ""}
                            onChange={(e) => {
                              const newSizeTypeId = e.target.value ? Number(e.target.value) : null;
                              const firstSizeOfType = sizes.find(s => s.size_type_id === newSizeTypeId);
                              handleSizeChange(index, "size_id", firstSizeOfType ? firstSizeOfType.id : 0);
                            }}
                            className="w-40 px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                          >
                            <option value="">Chọn loại kích cỡ</option>
                            {sizeTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name} ({type.type_code})
                              </option>
                            ))}
                          </select>
                          <select
                            value={size.size_id || ""}
                            onChange={(e) => handleSizeChange(index, "size_id", Number(e.target.value))}
                            className="flex-1 px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                          >
                            <option value="">Chọn kích cỡ</option>
                            {filteredSizes.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.value}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={size.stock || 0}
                            onChange={(e) => handleSizeChange(index, "stock", Number(e.target.value) || 0)}
                            className="w-24 px-4 py-2 bg-white text-[#2D2D2D] border border-[#94DAFF]/50 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50"
                            min="0"
                            placeholder="Số lượng"
                          />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="px-2 py-1 bg-red-400 hover:bg-red-600 text-white rounded-lg"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-[#94DAFF]/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedProduct(null);
                    setLocalImages([]); // Xóa local images khi hủy
                  }}
                  className="px-6 py-2 border border-[#94DAFF]/50 rounded-lg text-[#94B3FD] hover:bg-[#94DAFF]/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B983FF] hover:bg-[#B983FF]/90 text-white rounded-lg"
                >
                  {selectedProduct ? "Cập nhật" : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteDialogOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#B983FF] mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-[#94B3FD] mb-6">
                Bạn chắc chắn muốn xóa "{selectedProduct?.name}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProduct(null);
                  }}
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
        </div>
      )}
    </div>
  );
};
