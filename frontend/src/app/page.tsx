import Link from 'next/link';

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center 
    bg-white text-black p-8 px-4 py-8 sm:px-8 md:py-12">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Chợ Đồ Cũ Trực Tuyến Đa Năng
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-300">
          Mua bán, trao đổi các mặt hàng đã qua sử dụng một cách dễ dàng và an toàn.
        </p>
        <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
          Bắt Đầu Ngay
        </Link>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-blue-400">Tính Năng Nổi Bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-700">
              <h3 className="text-2xl font-semibold mb-4">Dễ Dàng Đăng Bán</h3>
              <p className="text-gray-300">Đăng sản phẩm chỉ trong vài bước đơn giản, thu hút người mua tiềm năng.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-700">
              <h3 className="text-2xl font-semibold mb-4">Tìm Kiếm Thông Minh</h3>
              <p className="text-gray-300">Tìm kiếm món đồ bạn cần nhanh chóng với bộ lọc và từ khóa thông minh.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-700">
              <h3 className="text-2xl font-semibold mb-4">Giao Dịch An Toàn</h3>
              <p className="text-gray-300">Hệ thống bảo mật giao dịch, đảm bảo quyền lợi cho cả người mua và người bán.</p>
            </div>
          </div>
        </div>
    </main>
  );
}
