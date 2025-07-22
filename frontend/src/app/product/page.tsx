import type { Metadata } from "next";

  export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "Explore our products!",
  };

  export default function ProductPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center 
            bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">
          Product Page
        </h1>
        <p className="text-4xl font-bold mb-3">
          Welcome to our product section!
        </p>
      </main>
    );
  }