'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import productApi from '@/app/utils/productApi';
import { Product, Category } from '@/app/types/product';
import { AxiosResponse } from 'axios';
import {
  FilterIcon,
  ChevronDownIcon,
  GridIcon,
  LayoutListIcon,
  XIcon,
  SearchIcon,
  TagIcon,
  DollarSignIcon,
} from 'lucide-react';
import categoryApi from '@/app/utils/categoryApi';
import ProductCard from '@/app/components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Lấy dữ liệu danh mục và sản phẩm
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Lấy danh mục theo slug
        const categoryResponse: AxiosResponse<Category[]> = await categoryApi.getAll();
        const foundCategory = categoryResponse.data.find((cat) => cat.slug === slug);
        if (!foundCategory) {
          setError('Danh mục không tồn tại.');
          setIsLoading(false);
          return;
        }
        setCategory(foundCategory);

        // Lấy sản phẩm theo slug danh mục
        const productResponse: AxiosResponse<Product[]> = await productApi.getProductByCategory(slug as string);
        setProducts(productResponse.data);
        setError(null);
      } catch (error: any) {
        console.error(`Lỗi khi lấy dữ liệu cho danh mục ${slug}:`, error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  // Trích xuất danh sách thương hiệu và kích cỡ duy nhất từ sản phẩm
  const brands = Array.from(new Set(products.map((product) => product.brand).filter((brand): brand is string => !!brand)));
  const sizes = Array.from(
    new Set(
      products
        .flatMap((product) => product.sizes?.map((size) => size.size_value) || [])
        .sort((a, b) => {
          // Sắp xếp kích cỡ: số tăng dần, chữ theo alphabet
          if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
            return parseInt(a) - parseInt(b);
          }
          return a.localeCompare(b);
        })
    )
  );
  // Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const price = product.discount_price ?? product.price;
    const matchesBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const [min, max] = range.split('-').map(Number);
        if (max) {
          return price >= min && price <= max;
        } else {
          return price > min;
        }
      });
    return matchesBrand && matchesPrice;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discount_price ?? a.price;
    const priceB = b.discount_price ?? b.price;
    switch (sortOption) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'discount':
        return (
          ((b.discount_price ? (b.price - b.discount_price) / b.price : 0) -
            (a.discount_price ? (a.price - a.discount_price) / a.price : 0)) * 100
        );
      default:
        return 0; // nổi bật
    }
  });

  // Xử lý thay đổi bộ lọc
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRanges((prev) => (prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]));
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedPriceRanges([]);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Danh mục không tồn tại</h1>
        <p className="mb-6">Xin lỗi, chúng tôi không tìm thấy danh mục bạn đang tìm kiếm.</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFF] p-8 px-4 py-8 sm:px-8 md:py-12 shadow-sm">
      {/* Tiêu đề danh mục */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">{category?.name}</h1>
        <p className="text-gray-600">
          Khám phá bộ sưu tập {category?.name.toLowerCase()} chất lượng cao, được chọn lọc kỹ càng.
        </p>
      </div>

      {/* Nút bộ lọc trên di động */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleMobileFilters}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white rounded-lg flex items-center justify-center"
        >
          <FilterIcon className="h-5 w-5 mr-2" />
          {mobileFiltersOpen ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
        </button>
      </div>

      {/* Sắp xếp và chuyển đổi chế độ hiển thị (Di động) */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <div className="relative w-3/4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50 appearance-none"
          >
            <option value="featured">Nổi bật</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name-asc">Tên: A đến Z</option>
            <option value="name-desc">Tên: Z đến A</option>
            <option value="discount">Giảm giá nhiều nhất</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg bg-white/80">
          <button
            className={`p-2 ${viewMode === 'grid' ? 'bg-[#94B3FD]/20 text-[#94B3FD]' : 'text-gray-500'}`}
            onClick={() => toggleViewMode('grid')}
            title="Chế độ lưới"
          >
            <GridIcon className="h-5 w-5" />
          </button>
          <button
            className={`p-2 ${viewMode === 'list' ? 'bg-[#94B3FD]/20 text-[#94B3FD]' : 'text-gray-500'}`}
            onClick={() => toggleViewMode('list')}
            title="Chế độ danh sách"
          >
            <LayoutListIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Thanh bộ lọc */}
        <div className={`md:w-1/4 lg:w-1/5 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white/80 rounded-lg shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Bộ lọc</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#2D2D2D] hover:text-[#94B3FD] transition"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Bộ lọc thương hiệu */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <TagIcon className="h-5 w-5 text-[#0cbee2] mr-2" />
                <h3 className="font-medium text-gray-700">Thương hiệu</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="custom-checkbox"
                    />
                    <span className="ml-2 text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bộ lọc khoảng giá */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <DollarSignIcon className="h-5 w-5 text-[#0cbee2] mr-2" />
                <h3 className="font-medium text-gray-700">Khoảng giá</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Dưới 500,000', range: '0-500000' },
                  { label: '500,000 - 1,000,000', range: '500000-1000000' },
                  { label: '1,000,000 - 2,000,000', range: '1000000-2000000' },
                  { label: '2,000,000 - 4,000,000', range: '2000000-4000000' },
                  { label: '4,000,000 - 10,000,000', range: '4000000-10000000' },
                  { label: 'Trên 10,000,000', range: '10000000-' },
                ].map(({ label, range }) => (
                  <label key={range} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(range)}
                      onChange={() => handlePriceRangeChange(range)}
                      className="custom-checkbox"
                    />
                    <span className="ml-2 text-gray-700">{label} ₫</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nút đóng bộ lọc trên di động */}
            <div className="mt-6 md:hidden">
              <button
                onClick={toggleMobileFilters}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Đóng bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Sắp xếp và chuyển đổi chế độ hiển thị (Máy tính) */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-medium text-gray-700">{sortedProducts.length}</span> sản phẩm
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Sắp xếp theo:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-3 py-2 bg-white/80 rounded-lg border border-gray-200 text-[#2D2D2D]
                    focus:outline-none focus:ring-2 focus:ring-[#B983FF]/50 appearance-none pr-8"
                  >
                    <option value="featured">Nổi bật</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name-asc">Tên: A đến Z</option>
                    <option value="name-desc">Tên: Z đến A</option>
                    <option value="discount">Giảm giá nhiều nhất</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg bg-white/80">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#94B3FD]/20 text-[#94B3FD]' : 'text-gray-500'}`}
                  onClick={() => toggleViewMode('grid')}
                  title="Chế độ lưới"
                >
                  <GridIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bộ lọc đang áp dụng */}
          <div className="mb-6">
            {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedPriceRanges.length > 0) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#94B3FD]/20 text-[#94B3FD]"
                  >
                    {brand}
                    <button className="ml-1 focus:outline-none" onClick={() => handleBrandChange(brand)}>
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {selectedPriceRanges.map((range) => {
                  const [min, max] = range.split('-').map(Number);
                  const label = max
                    ? `₫${min.toLocaleString()} - ₫${max.toLocaleString()}`
                    : `Trên ₫${min.toLocaleString()}`;
                  return (
                    <span
                      key={range}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#94B3FD]/20 text-[#94B3FD]"
                    >
                      {label}
                      <button
                        className="ml-1 focus:outline-none"
                        onClick={() => handlePriceRangeChange(range)}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  className="text-xs text-[#2D2D2D] hover:underline"
                  onClick={clearAllFilters}
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {sortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images?.[0]?.image_url || '/placeholder-image.jpg'}
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
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images?.[0]?.image_url || '/placeholder-image.jpg'}
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
                ))}
              </div>
            )
          ) : (
            // Không tìm thấy sản phẩm
            <div className="text-center py-12 bg-white/80 rounded-lg">
              <SearchIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
              <p className="mt-1 text-gray-500">Hãy thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm.</p>
              <button
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-[#2D2D2D] to-[#94B3FD] text-white rounded-full hover:shadow-md transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}              
        </div>
      </div>
    </div>
  );
}