'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductCard from '@/app/components/ProductCard';
import { Product, Promotion } from '@/app/types/product';
import productApi from '@/app/utils/productApi';
import promotionApi from '@/app/utils/promotionApi';
import { AxiosResponse } from 'axios';

export default function HomePage() {
  // HeroSection
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: 'https://res.cloudinary.com/dqmf0hoc5/image/upload/v1755312566/banner3_idz8q1.png',
      tagline: '',
      subtext: '',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // StoreLocations
  const [selectedStore, setSelectedStore] = useState(0);
  const stores = [
    {
      id: 1,
      name: 'ZZ_2hand Quận 1',
      address: '123 Lê Lợi, Quận 1, TP.HCM',
      hours: 'Thứ 2 - Thứ 7: 10h-20h, Chủ nhật: 11h-18h',
      phone: '(028) 555-1234',
      image: 'https://res.cloudinary.com/dqmf0hoc5/image/upload/v1755313328/banner5_qceki9.avif',
      mapUrl: 'https://www.google.com/maps?q=123+Lê+Lợi,+Quận+1,+TP.HCM',
    },
    {
      id: 2,
      name: 'ZZ_2hand Quận 7',
      address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
      hours: 'Thứ 2 - Thứ 7: 11h-19h, Chủ nhật: 12h-17h',
      phone: '(028) 555-5678',
      image: 'https://res.cloudinary.com/dqmf0hoc5/image/upload/v1755313328/banner5_qceki9.avif',
      mapUrl: 'https://www.google.com/maps?q=456+Nguyễn+Thị+Thập,+Quận+7,+TP.HCM',
    },
  ];

  // FeaturedProducts and Promotions
  const [categories, setCategories] = useState<{ name: string; products: Product[] }[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
    fetchPromotions();
  }, []);

  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<any> = await productApi.getBestSellers();
      const data = response.data.data || [];
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Không thể tải danh sách sản phẩm bán chạy:", err);
      toast.error("Không thể tải danh sách sản phẩm bán chạy!");
      setCategories([]);
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
      console.error("Không thể tải danh sách khuyến mãi:", err);
      toast.error("Không thể tải danh sách khuyến mãi!");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F6FAFF]">   
      {/* HeroSection */}
      <section className="relative h-[700px] overflow-hidden rounded-xl shadow-md">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={slide.image}
              alt={slide.tagline}
              width={1470}
              height={981}
              className="rounded-xl object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0"></div>
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white">
                <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
                  {slide.tagline}
                </h1>
                <p className="mb-6 text-xl">{slide.subtext}</p>
                <Link
                  href="/products"
                  className="rounded-full bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] px-8 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Mua sắm ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* BrandIntro */}
      <section className="py-16 bg-gradient-to-r from-[#94B3FD]/20 to-[#94DAFF]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#0cbee2]">
                Giới thiệu ZZ_2hand
              </h2>
              <p className="text-gray-700 mb-6">
                ZZ_2hand là thương hiệu thời trang second-hand mang hơi thở mới mẻ, kết hợp phong cách và tính bền vững.
              </p>
              <p className="text-gray-700 mb-6">
                Thành lập từ 2020, chúng tôi tuyển chọn kỹ lưỡng những món đồ độc đáo, khuyến khích thời trang tuần hoàn và giảm thiểu rác thải.
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white px-6 py-3 rounded-md hover:shadow-lg transition"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://res.cloudinary.com/dqmf0hoc5/image/upload/v1755313857/photo-1567401893414-76b7b1e5a7a5_ktbrdm.avif"
                  alt="Khái niệm thời trang bền vững"
                  width={735}
                  height={490}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto transform hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FeaturedProducts */}
      <section className="py-16 bg-gradient-to-r from-[#99FEFF]/10 to-[#0cbee2]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#0cbee2]">
            Sản phẩm bán chạy
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-transparent border-[#0cbee2] rounded-full animate-spin mx-auto"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-white/80 rounded-lg">
              <p className="text-gray-600">Không có sản phẩm bán chạy nào.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.name} className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-[#94B3FD]">
                    {category.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.isArray(category.products) ? (
                    category.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        image={product.images?.[0]?.image_url || '/images/placeholder.jpg'}
                        name={product.name}
                        category={product.category_name}
                        originalPrice={product.price}
                        salePrice={product.discount_price}
                        discount={
                          product.discount_price
                            ? Math.round(((product.price - product.discount_price) / product.price) * 100)
                            : undefined
                        }
                        sizes={product.sizes || []}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">Không có sản phẩm trong danh mục này.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* StoreLocations */}
      <section className="py-16 bg-gradient-to-r from-[#94DAFF]/20 to-[#99FEFF]/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#0cbee2]">
            Địa điểm cửa hàng
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-4 text-[#94B3FD]">
                  Các cửa hàng
                </h3>
                <ul>
                  {stores.map((store, index) => (
                    <li key={store.id}>
                      <button
                        onClick={() => setSelectedStore(index)}
                        className={`w-full text-left py-3 px-4 rounded-md transition ${selectedStore === index ? 'bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] text-white' : 'hover:bg-[#99FEFF]/10 text-gray-700'}`}
                      >
                        {store.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <Image
                    src={stores[selectedStore].image}
                    alt={stores[selectedStore].name}
                    width={980}
                    height={192}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[#0cbee2]">
                    {stores[selectedStore].name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {stores[selectedStore].address}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Giờ mở cửa:</strong> {stores[selectedStore].hours}
                  </p>
                  <p className="text-gray-600 mb-6">
                    <strong>Điện thoại:</strong> {stores[selectedStore].phone}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={stores[selectedStore].mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#94B3FD] hover:bg-[#0cbee2] text-white px-4 py-2 rounded-md transition"
                    >
                      <MapPinIcon size={18} />
                      Xem trên bản đồ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PromotionsMarquee */}
      <section className="">
        <div className="w-full">
          <div className="bg-gradient-to-r from-[#0cbee2] to-[#94DAFF] py-3 overflow-hidden rounded-md">
            <div className="inline-flex animate-[marquee_20s_linear_infinite] hover:animation-pause whitespace-nowrap">
              {promotions.length === 0 ? (
                <span className="mx-4 text-white font-medium">
                  Không có chương trình khuyến mãi nào đang diễn ra.
                </span>
              ) : (
                <>
                  {promotions.map((promo) => (
                    <span key={promo.id} className="mx-4 text-white font-medium">
                      🔥 {promo.name}: {promo.description || `Giảm ${promo.discount_type === 'PERCENT' ? `${promo.discount_value}%` : promo.discount_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`} từ {new Date(promo.start_date).toLocaleDateString('vi-VN')} đến {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                    </span>
                  ))}
                  {/* Duplicate promotions for seamless looping */}
                  {promotions.map((promo) => (
                    <span key={`duplicate-${promo.id}`} className="mx-4 text-white font-medium">
                      🔥 {promo.name}: {promo.description || `Giảm ${promo.discount_type === 'PERCENT' ? `${promo.discount_value}%` : promo.discount_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`} từ {new Date(promo.start_date).toLocaleDateString('vi-VN')} đến {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PromoBanner */}
      <section className="py-16 bg-gradient-to-r from-[#99FEFF]/10 to-[#0cbee2]/10">
        <div className="container mx-auto px-4">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(rgba(148, 179, 253, 0.85), rgba(185, 131, 255, 0.85)), url(https://res.cloudinary.com/dqmf0hoc5/image/upload/v1755314254/photo-1556905055-8f358a7a47b2_nskqjv.avif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="py-16 px-8 md:px-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Khám phá kho báu thời trang độc đáo
              </h2>
              <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                Duyệt qua bộ sưu tập phong phú các món đồ thời trang second-hand. Từ những món đồ cổ điển đến thiết kế hiện đại, tìm phong cách hoàn hảo của bạn với chi phí chỉ bằng một phần nhỏ.
              </p>
              <Link
                href="/"
                className="bg-white text-[#0cbee2] hover:bg-[#99FEFF] hover:text-[#94B3FD] font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}