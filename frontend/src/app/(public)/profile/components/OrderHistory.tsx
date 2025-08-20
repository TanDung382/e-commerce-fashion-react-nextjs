import React from 'react';
import { ShoppingBagIcon } from 'lucide-react';

export function OrderHistory() { 
  const orders = [
    {
      id: 'ORD-12345',
      date: 'June 15, 2023',
      total: '$125.99',
      status: 'Delivered',
      items: 3,
    },
    {
      id: 'ORD-12346',
      date: 'May 22, 2023',
      total: '$78.50',
      status: 'Delivered',
      items: 2,
    },
    {
      id: 'ORD-12347',
      date: 'April 10, 2023',
      total: '$245.00',
      status: 'Delivered',
      items: 4,
    },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBagIcon size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <h3 className="font-medium">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>{order.items} items</p>
                <p className="font-medium">{order.total}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button className="text-[#B983FF] hover:text-[#94B3FD] text-sm font-medium">
                  View Order Details
                </button>
                <button className="px-4 py-1 border border-[#B983FF] text-[#B983FF] rounded-lg hover:bg-[#B983FF]/10 text-sm">
                  Buy Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}