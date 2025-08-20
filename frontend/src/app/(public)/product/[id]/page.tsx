'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productApi from '@/app/utils/productApi';
import { Product } from '@/app/types/product';
import { AxiosResponse } from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/context/cartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError('ID sản phẩm không hợp lệ.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response: AxiosResponse<Product> = await productApi.getById(id as string);
        setProduct(response.data);
        setError(null);
      } catch (error: any) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!isLoading && product) {
      const firstInStockSize = product.sizes.find((size) => size.stock > 0);
      if (firstInStockSize) {
        setSelectedSize(firstInStockSize.size_value);
      }
    }
  }, [isLoading, product]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === (product?.images.length ?? 1) - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? (product?.images.length ?? 1) - 1 : prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeSelect = (sizeValue: string) => {
    setSelectedSize(sizeValue);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast.error('Vui lòng chọn kích thước!', {
        duration: 1500,
      });
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success('Đã thêm vào giỏ hàng!', {
      duration: 1500,
    });
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize) {
      toast.error('Vui lòng chọn kích thước!', {
        duration: 1500,  
      });
      return;
    }
    addToCart(product, selectedSize, quantity);
      router.push('/cart');
  };

  if (!product && !isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center bg-white">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <p className="mb-6">Xin lỗi, chúng tôi không tìm thấy sản phẩm bạn đang tìm kiếm.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white rounded-full font-semibold hover:shadow-lg transition"
        >
          Trở về trang chủ
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return <p>Sản phẩm không tồn tại.</p>;

  const formattedPrice = product.discount_price
    ? parseFloat(product.discount_price.toString()).toLocaleString() + 'đ'
    : parseFloat(product.price.toString()).toLocaleString() + 'đ';
  const formattedOriginalPrice = product.discount_price
    ? parseFloat(product.price.toString()).toLocaleString() + 'đ'
    : null;

  const genderMap: Record<string, string> = {
    male: 'Nam',
    female: 'Nữ',
    unisex: 'Unisex',
  };
  const translatedGender = genderMap[product.gender || ''] || 'Không xác định';

  const isOutOfStock = product.sizes.every((size) => size.stock <= 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFF] p-8 px-4 py-8 sm:px-8 md:py-12 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="relative flex justify-center items-center mb-4 overflow-hidden rounded-lg">
              <Image
                src={product.images?.[currentImage]?.image_url || '/placeholder-image.jpg'}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover rounded-lg"
              />
              {product.discount_price && (
                <div className="absolute top-4 left-4 bg-[#0cbee2] text-white text-sm font-bold px-2 py-1 rounded">
                  -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </div>
              )}
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition"
                onClick={prevImage}
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition"
                onClick={nextImage}
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-800" />
              </button>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    currentImage === index ? 'border-[#B983FF]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.image_url || '/placeholder-image.jpg'}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Product Info */}
        <div className="order-1 md:order-2">
          <div className="text-sm text-[#94B3FD] mb-1">{product.brand || 'Không có'}</div>
          <div className="flex items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mr-2">
              {product.name}
            </h1>
            <span
              className={`text-xs font-semibold px- py-1 rounded ${
                isOutOfStock
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {isOutOfStock ? 'Hết Hàng' : 'Còn Hàng'}
            </span>
          </div>
          <div className="flex items-center mb-6">
            {product.discount_price ? (
              <>
                <span className="text-2xl font-bold text-red-600 mr-2">
                  {formattedPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formattedOriginalPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-600">
                {formattedPrice}
              </span>
            )}
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-black">Kích thước</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.size_value}
                  onClick={() => size.stock > 0 && handleSizeSelect(size.size_value)}
                  disabled={size.stock <= 0}
                  className={`w-11 h-10 flex items-center justify-center rounded-md border ${
                    size.stock <= 0
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : selectedSize === size.size_value
                      ? 'bg-[#0cbee2] text-white border-[#0cbee2]'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-[#94B3FD]'
                  }`}
                >
                  {size.size_value}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-red-500 text-sm mt-2">
                Vui lòng chọn kích thước
              </p>
            )}
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-black mb-2">Số lượng</h3>
            <div className="flex items-center">
              <button
                className="w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-l-md hover:bg-gray-100"
                onClick={decrementQuantity}
                disabled={isOutOfStock}
              >
                -
              </button>
              <div className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-300 text-black">
                {quantity}
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-r-md hover:bg-gray-100"
                onClick={incrementQuantity}
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <button
              disabled={isOutOfStock || !selectedSize}
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3 rounded-full font-semibold flex items-center justify-center transition ${
                isOutOfStock || !selectedSize
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0cbee2] text-white hover:shadow-lg'
              }`}
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              disabled={isOutOfStock || !selectedSize}
              onClick={handleBuyNow}
              className={`flex-1 px-6 py-3 rounded-full font-semibold flex items-center justify-center transition ${
                isOutOfStock || !selectedSize
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#036476] text-white hover:shadow-lg'
              }`}
            >
              {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="flex overflow-x-auto border-b border-gray-200 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-b-2 border-[#B983FF] text-[#B983FF]'
                : 'text-gray-600 hover:text-[#94B3FD]'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'warranty'
                ? 'border-b-2 border-[#B983FF] text-[#B983FF]'
                : 'text-gray-600 hover:text-[#94B3FD]'
            }`}
            onClick={() => setActiveTab('warranty')}
          >
            Chính sách
          </button>
        </div>
        <div className="py-6">
          {activeTab === 'details' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-bold text-black mb-3">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || 'Không có mô tả'}
              </p>
              <h3 className="text-lg font-bold text-black mt-6 mb-3">
                Thông số kỹ thuật
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  'Thương hiệu': product.brand || 'Không có',
                  'Màu sắc': product.color || 'Không có',
                  'Chất liệu': product.material || 'Không có',
                  'Giới tính': translatedGender,
                }).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-700">
                      {key}:&nbsp;
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'warranty' && (
            <div className="prose max-w-none text-gray-700 items-center">
              <h3 className="text-lg font-bold text-red-500 text-center">
                CHÍNH SÁCH MUA HÀNG VÀ BẢO HÀNH TẠI ZZ_2HAND
              </h3>
              <p className="text-sm text-red-500 italic mb-4 text-center underline">
                Áp dụng cho cả mua sắm online và offline.
              </p>
              <ul className="list-decimal list-outside space-y-3 pl-5">
                <li>
                  <span className="font-semibold">
                    Miễn phí vận chuyển toàn quốc:
                  </span>{' '}
                  Tất cả sản phẩm mua tại ZZ_2hand đều được miễn phí vận chuyển trên toàn quốc.
                </li>
                <li>
                  <span className="font-semibold">
                    Kiểm tra sản phẩm trước khi thanh toán:
                  </span>{' '}
                  Quý khách vui lòng kiểm tra kỹ tình trạng sản phẩm trước khi thanh toán. Sản phẩm sau khi thanh toán sẽ không được đổi trả, trừ các trường hợp được liệt kê dưới đây.
                </li>
                <li>
                  <span className="font-semibold">
                    Các trường hợp được đổi trả:
                  </span>
                  <ul className="list-disc list-outside pl-6 mt-2 space-y-2">
                    <li>
                      <span className="font-medium">
                        Sản phẩm không đúng tình trạng so với ảnh chi tiết:
                      </span>{' '}
                      Với khách hàng mua online, ZZ_2hand sẽ gửi ảnh chi tiết sản phẩm, kèm theo các lỗi (rách, trầy, nứt, bong keo,...) để khách hàng nắm rõ tình trạng. Nếu sản phẩm nhận được không đúng như ảnh hoặc thông tin đã cung cấp, ZZ_2hand sẽ hoàn trả ngay lập tức.
                    </li>
                    <li>
                      <span className="font-medium">
                        Phát hiện sản phẩm giả:
                      </span>{' '}
                      Nếu phát hiện sản phẩm là hàng giả, quý khách vui lòng liên hệ với CSKH hoặc nhắn tin trực tiếp qua fanpage. ZZ_2hand sẽ ghi nhận, thu thập dữ liệu và tiến hành kiểm tra (thông qua admin group check, cá nhân có chuyên môn, hoặc cộng đồng group check).
                      <ul className="list-circle list-outside pl-6 mt-2 space-y-2">
                        <li>
                          Trong năm đầu tiên phát hiện hàng giả: Hoàn tiền{' '}
                          <span className="font-semibold text-[#2D2D2D]">100% giá trị sản phẩm</span> khi mua.
                        </li>
                        <li>
                          Từ năm thứ hai trở đi: Mỗi năm tăng{' '}
                          <span className="font-semibold text-[#2D2D2D]">10% giá trị hoàn tiền</span>.
                        </li>
                        <li>
                          Cách thức nhận hoàn tiền: Chuyển khoản trực tiếp cho khách hàng. Mọi chi phí phát sinh từ vận chuyển trả hàng hoặc kiểm định đều do ZZ_2hand chịu, khách hàng không chịu bất kỳ chi phí nào.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">
                    Sản phẩm đã qua sử dụng:
                  </span>
                  <ul className="list-disc list-outside pl-6 mt-2 space-y-2">
                    <li>
                      Chính sách đổi trả ở mục 3a (sản phẩm không đúng tình trạng) không áp dụng. Chỉ áp dụng mục 3b (phát hiện hàng giả).
                    </li>
                    <li>
                      Nếu sản phẩm đã sử dụng bị hỏng trong vòng{' '}
                      <span className="font-semibold text-[#2D2D2D]">1 tháng</span>, khách hàng được đổi mẫu khác với bù trừ, khấu hao{' '}
                      <span className="font-semibold text-[#2D2D2D]">30%</span> giá trị sản phẩm (tức giá trị sản phẩm khách mua sẽ bị trừ 30%, khách hàng sẽ mua sản phẩm khác trong khoảng giá bù trừ hợp lý).
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">
                    Hiệu lực chính sách:
                  </span>{' '}
                  Chính sách này có hiệu lực từ ngày{' '}
                  <span className="font-semibold text-[#2D2D2D]">01/08/2024</span>.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}