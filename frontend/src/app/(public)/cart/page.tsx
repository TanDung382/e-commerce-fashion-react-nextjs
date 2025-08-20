'use client';

import { useCart } from '@/app/context/cartContext';
import { useAuth } from '@/app/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Trash2, ShoppingCart, ArrowLeftIcon, MinusIcon, PlusIcon, Banknote, CreditCard, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Sử dụng state để kiểm soát render ban đầu, tránh lỗi hydrate
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Đánh dấu là client sau khi mount
  }, []);

  const subtotal = cart.reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Giỏ hàng trống.');
      return;
    }
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      toast.error('Vui lòng đăng nhập để tiếp tục thanh toán.');
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  if (!isClient) {
    return <div className="min-h-screen flex flex-col bg-[#F6FAFF] p-8 px-4 py-8 sm:px-8 md:py-12 shadow-sm"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFF] p-8 px-4 py-8 sm:px-8 md:py-12 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#B983FF]/10 to-[#94DAFF]/10 border-b">
            <h1 className="text-3xl font-bold mb-8 text-[#B983FF]">Giỏ Hàng</h1>
          </div>
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-[#94DAFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart size={32} className="text-[#94DAFF]" />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Giỏ Hàng Của Bạn Trống</h1>
                <p className="text-gray-600 mb-8">Có vẻ như bạn chưa thêm gì vào giỏ hàng.</p>
                <Link
                  href="/"
                  className="inline-flex items-center bg-gradient-to-r from-[#B983FF] to-[#94DAFF] text-white px-6 py-3 rounded-md hover:shadow-lg transition"
                  onClick={() => localStorage.removeItem('redirectAfterLogin')}
                >
                  <ArrowLeftIcon size={16} className="mr-2" />
                  Tiếp Tục Mua Sắm
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-[#B983FF]/10 to-[#94DAFF]/10 border-b">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                          <h2 className="font-bold text-[#2D2D2D]">Sản Phẩm</h2>
                        </div>
                        <div className="col-span-3 text-center">
                          <h2 className="font-bold text-[#2D2D2D]">Giá</h2>
                        </div>
                        <div className="col-span-2 text-center">
                          <h2 className="font-bold text-[#2D2D2D]">Số Lượng</h2>
                        </div>
                        <div className="col-span-3 text-right">
                          <h2 className="font-bold text-[#2D2D2D]">Tổng</h2>
                        </div>
                      </div>
                    </div>
                    {cart.map((item) => (
                      <div key={`${item.productId}-${item.sizeValue}`} className="p-4 border-b border-gray-100">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <div className="flex items-center">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="ml-4">
                                <h3 className="font-medium text-gray-800">{item.productName}</h3>
                                <p className="text-sm text-gray-500">Kích thước: {item.sizeValue}</p>
                                {item.discountPrice && (
                                  <p className="text-sm text-gray-500">
                                    Giá gốc:{' '}
                                    <span className="line-through">
                                      {item.price.toLocaleString('vi-VN')} đ
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3 text-center">
                            <span className="text-[#94DAFF] font-semibold">
                              {(item.discountPrice || item.price).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => updateQuantity(item.productId, item.sizeValue, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full 
                                border border-gray-300 text-[#2D2D2D] hover:bg-[#94DAFF]/10 hover:border-[#94DAFF]"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon size={14} />
                              </button>
                              <span className="mx-2 w-8 text-center text-[#2D2D2D]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.sizeValue, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full 
                                border border-gray-300 text-[#2D2D2D] hover:bg-[#94DAFF]/10 hover:border-[#94DAFF]"
                              >
                                <PlusIcon size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className="font-semibold text-[#2D2D2D]">
                                {((item.discountPrice || item.price) * item.quantity).toLocaleString('vi-VN')} đ
                              </span>
                              <button
                                onClick={() => removeFromCart(item.productId, item.sizeValue)}
                                className="ml-3 text-gray-400 hover:text-[#B983FF]"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Order Summary */}
                <div className="lg:w-1/3">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Tóm Tắt Đơn Hàng</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-bold text-[#2D2D2D]">{subtotal.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span className="font-bold text-[#2D2D2D]">{shippingCost.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-800">Tổng cộng</span>
                          <span className="font-bold text-[#B983FF]">{total.toLocaleString('vi-VN')} đ</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-[#B983FF] to-[#94DAFF] text-white text-center py-3 rounded-md hover:shadow-lg transition flex items-center justify-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Tiến Hành Thanh Toán
                    </button>
                    <div className="mt-6 text-sm text-gray-500">
                      <p className="mb-2">Chúng tôi chấp nhận:</p>
                      <div className="flex">
                        <Banknote className="text-gray-500 hover:text-gray-700" />
                        <CreditCard className="text-gray-500 hover:text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}