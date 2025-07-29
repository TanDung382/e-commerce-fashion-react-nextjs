import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="text-center mt-12 p-4 text-red-600">
      <h2 className="text-3xl font-bold mb-4">Không có quyền truy cập</h2>
      <p className="text-lg mb-6">Bạn không có đủ quyền để xem trang này.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Về trang chủ
      </Link>
    </div>
  );
};

export default UnauthorizedPage;