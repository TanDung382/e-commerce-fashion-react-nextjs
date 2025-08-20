'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthProvider';
import { useCart } from '@/app/context/cartContext';
import orderApi from '@/app/utils/orderApi';
import { toast } from 'react-hot-toast';
import { CreditCardIcon, TruckIcon, CheckIcon, ArrowLeftIcon } from 'lucide-react';

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1); 
  const [address, setAddress] = useState({
    full_address_line: '',
    house_number: '',
    street_name: '',
    neighborhood: '',
    ward: '',
    city: '',
    country: 'Vietnam',
    recipient_name: '',
    recipient_phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'zalopay' | 'bank'>('cash');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6FAFF]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0cbee2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subtotal = cart.reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);
  const shippingCost = 0; 
  const total = subtotal + shippingCost;

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Giỏ hàng trống.', {
        duration: 1500,
        style: {
          background: 'red',
          color: '#fff',
        },
      });
      return;
    }

    const orderData = {
      user_id: user.id,
      order_address: address,
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.discountPrice || item.price,
        size_value: item.sizeValue,
        product_name: item.productName,
        product_image: item.imageUrl ?? undefined,
      })),
      payment_method: paymentMethod,
      note: note || undefined,
    };

    try {
      setIsSubmitting(true);
      const response = await orderApi.create(orderData);
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Đặt hàng thành công!', {
        duration: 1500,
      });
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', {
        duration: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#F6FAFF] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-[#94DAFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon size={32} className="text-[#94DAFF]" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được đặt thành công.
            </p>
            <p className="text-gray-600 mb-8">Mã đơn hàng: ZZ87654321</p>
            <Link
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white px-6 py-3 rounded-md hover:shadow-lg transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFF] py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-[#0cbee2]">Thanh toán</h1>
        {/* Checkout Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-[#0cbee2]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-[#0cbee2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium">Giao hàng</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-[#0cbee2]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-[#0cbee2]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-[#0cbee2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium">Thanh toán</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-[#0cbee2]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-[#0cbee2]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-[#0cbee2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-sm font-medium">Xác nhận</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {step === 1 && (
                <div>
                  <div className="p-4 bg-gradient-to-r from-[#0cbee2]/10 to-[#94DAFF]/10 border-b flex items-center">
                    <TruckIcon size={20} className="text-[#94B3FD] mr-2" />
                    <h2 className="font-medium text-gray-800">Thông tin giao hàng</h2>
                  </div>
                  <form id="shipping-form" onSubmit={handleSubmitShipping} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          id="recipient_name"
                          value={address.recipient_name}
                          onChange={(e) => setAddress({ ...address, recipient_name: e.target.value })}
                          className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-gray-300 rounded-md
                          focus:outline-none focus:ring-2 focus:ring-[#94B3FD]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="recipient_phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          id="recipient_phone"
                          value={address.recipient_phone}
                          onChange={(e) => setAddress({ ...address, recipient_phone: e.target.value })}
                          className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-[#94B3FD]"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="full_address_line" className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ đầy đủ
                        </label>
                        <input
                          type="text"
                          id="full_address_line"
                          value={address.full_address_line}
                          onChange={(e) => setAddress({ ...address, full_address_line: e.target.value })}
                          className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-[#94B3FD]"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú (tùy chọn)
                        </label>
                        <textarea
                          id="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full px-4 py-2 bg-white text-[#2D2D2D] border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-[#94B3FD]"
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Link
                        href="/cart"
                        className="inline-flex items-center text-[#0cbee2] hover:underline"
                      >
                        <ArrowLeftIcon size={16} className="mr-1" />
                        Quay lại giỏ hàng
                      </Link>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white px-6 py-2 rounded-md hover:shadow-lg transition"
                      >
                        Tiếp tục thanh toán
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div className="p-4 bg-gradient-to-r from-[#0cbee2]/10 to-[#94DAFF]/10 border-b flex items-center">
                    <CreditCardIcon size={20} className="text-[#94B3FD] mr-2" />
                    <h2 className="font-medium text-gray-800">Phương thức thanh toán</h2>
                  </div>
                  <form id="checkout-form" onSubmit={handleSubmitPayment} className="p-6">
                    <div className="space-y-4 mb-6">
                      <div
                        className={`cursor-pointer flex items-center p-2 rounded-md ${paymentMethod === 'cash' ? 'ring-2 ring-[#0cbee2]' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <input
                          type="radio"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                          className="mr-2 accent-[#0cbee2]"
                        />
                        <span className="text-gray-700">Tiền mặt</span>
                      </div>
                      <div
                        className={`cursor-pointer flex items-center p-2 rounded-md ${paymentMethod === 'momo' ? 'ring-2 ring-[#0cbee2]' : ''}`}
                        onClick={() => setPaymentMethod('momo')}
                      >
                        <input
                          type="radio"
                          value="momo"
                          checked={paymentMethod === 'momo'}
                          onChange={() => setPaymentMethod('momo')}
                          className="mr-2 accent-[#0cbee2]"
                        />
                        <span className="text-gray-700">Momo</span>
                      </div>
                      <div
                        className={`cursor-pointer flex items-center p-2 rounded-md ${paymentMethod === 'zalopay' ? 'ring-2 ring-[#0cbee2]' : ''}`}
                        onClick={() => setPaymentMethod('zalopay')}
                      >
                        <input
                          type="radio"
                          value="zalopay"
                          checked={paymentMethod === 'zalopay'}
                          onChange={() => setPaymentMethod('zalopay')}
                          className="mr-2 accent-[#0cbee2]"
                        />
                        <span className="text-gray-700">ZaloPay</span>
                      </div>
                      <div
                        className={`cursor-pointer flex items-center p-2 rounded-md ${paymentMethod === 'bank' ? 'ring-2 ring-[#0cbee2]' : ''}`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <input
                          type="radio"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={() => setPaymentMethod('bank')}
                          className="mr-2 accent-[#0cbee2]"
                        />
                        <span className="text-gray-700">Chuyển khoản ngân hàng</span>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center text-[#0cbee2] hover:underline"
                      >
                        <ArrowLeftIcon size={16} className="mr-1" />
                        Quay lại giao hàng
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white px-6 py-2 rounded-md hover:shadow-lg transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Tóm tắt đơn hàng</h2>
              <div className="max-h-64 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.sizeValue}`}
                    className="flex items-center py-3 border-b border-gray-100"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.imageUrl || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#94DAFF] rounded-full text-xs flex items-center justify-center text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {item.productName} ({item.sizeValue})
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-red-600 font-semibold">
                          {(item.discountPrice || item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                        <span className="text-sm text-gray-500">
                          {((item.discountPrice || item.price) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-bold text-black">{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-bold text-black">{shippingCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Tổng cộng</span>
                    <span className="font-bold text-[#0cbee2]">{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                </div>
              </div>
              {step === 2 && (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-md font-semibold transition ${isSubmitting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white hover:shadow-lg'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}