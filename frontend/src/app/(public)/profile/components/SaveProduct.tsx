import React from 'react';
import { HeartIcon } from 'lucide-react';

export function SaveProduct() { 
  const savedItems = [
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      price: '$89.99',
      image:
        'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      name: 'Classic Leather Boots',
      price: '$129.99',
      image:
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      name: 'Boho Style Dress',
      price: '$59.99',
      image:
        'https://images.unsplash.com/photo-1612722432474-b971cdcea546?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Saved Items</h2>
      {savedItems.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-gray-500">
            You don't have any saved items yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-[#B983FF] mt-1">{item.price}</p>
                <div className="mt-4 flex justify-between">
                  <button className="px-4 py-1.5 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                    Add to Cart
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500">
                    <HeartIcon size={20} className="fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}