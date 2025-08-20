'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  category: string | null;
  originalPrice: number;
  salePrice?: number | null | undefined;
  discount?: number;
  sizes: { size_value: string; stock: number }[];
}

export default function ProductCard({
  id,
  image,
  name,
  category,
  originalPrice,
  salePrice,
  discount,
  sizes,
}: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isOutOfStock = sizes.every((size) => size.stock <= 0);

  return (
    <Link
      href={`/product/${id}`}
      className="block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="bg-white/80 rounded-lg overflow-hidden shadow-md hover:shadow-lg">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-64 object-cover" />

          {/* Nút XEM NGAY xuất hiện khi hover */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-0 mb-2 px-4 py-2 rounded-full bg-[#0cbee2] text-white text-sm font-semibold shadow-md transition-all duration-500 ease-out
              ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
            `}
          >
            XEM NGAY
          </div>

          {discount && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-[#0cbee2] text-white text-sm font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 hover:text-[#068ba2] transition text-[#2D2D2D]">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{category}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {salePrice && !isOutOfStock ? (
                <>
                  <span className="text-red-600 font-bold">
                    {salePrice.toLocaleString()}đ
                  </span>
                  <span className="ml-2 text-gray-400 text-sm line-through">
                    {originalPrice.toLocaleString()}đ
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-bold">
                  {originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>
            {isOutOfStock && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                Hết hàng
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
