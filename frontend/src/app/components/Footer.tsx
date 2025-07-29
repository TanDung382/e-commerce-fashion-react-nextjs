'use client';

import Link from 'next/link';
import { CiFacebook } from "react-icons/ci";
import { TbBrandTiktok } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";

const Footer = () => { 
return (
    <footer className="bg-gradient-to-r from-[#94DAFF] to-[#99FEFF] text-[#1F1F1F]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="text-2xl font-bold m-1.5">ZZ_2hand</div>
            <button className="px-6 py-2 bg-gradient-to-r from-[#B983FF] to-[#94B3FD] text-white 
              rounded-full hover:opacity-90 transition-opacity">
              Shop Now
            </button>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#B983FF] transition-colors"
                  >
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#B983FF] transition-colors"
                  >
                    Shoes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#B983FF] transition-colors"
                  >
                    Our Stores
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#B983FF] transition-colors"
                  >
                    Sale
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#B983FF] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li>Phone: (212) 555-7890</li>
                <li>Email: info@zz2hand.com</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-[#B983FF] transition-colors">
                <CiFacebook  size={24} />
              </Link>
              <Link href="#" className="hover:text-[#B983FF] transition-colors">
                <TbBrandTiktok   size={24} />
              </Link>
              <Link href="#" className="hover:text-[#B983FF] transition-colors">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" className="hover:text-[#B983FF] transition-colors">
                <FiYoutube size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-300/30 text-center">
          <p>© 2025 ZZ_2hand</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;