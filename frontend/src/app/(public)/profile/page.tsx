'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  SettingsIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { Info } from './components/Info';
import { OrderHistory } from './components/OrderHistory';
import { SaveProduct } from './components/SaveProduct';
import { AccountSetting } from './components/AccountSetting';

const ProfilePage = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  if (isLoading) {
    return <div className="text-center mt-12 text-lg">Đang tải thông tin...</div>;
  }

  if (!user) {
    return null; 
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden pt-6">
      <div className="bg-gradient-to-r from-[#B983FF] to-[#94DAFF] p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-white p-1 rounded-full w-24 h-24 flex items-center justify-center">
                <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
                  <UserIcon size={40} className="text-gray-500" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-white/80">{user.email}</p>
                <p className="text-white/80 mt-1">Member since: January 2023</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 bg-gray-50 p-4 md:p-6">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('personal')}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'personal' ? 'bg-[#B983FF]/10 text-[#B983FF]' : 'hover:bg-gray-100'}`}
                    >
                      <UserIcon size={18} className="mr-3" />
                      <span>Personal Information</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#B983FF]/10 text-[#B983FF]' : 'hover:bg-gray-100'}`}
                    >
                      <ShoppingBagIcon size={18} className="mr-3" />
                      <span>Order History</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-[#B983FF]/10 text-[#B983FF]' : 'hover:bg-gray-100'}`}
                    >
                      <HeartIcon size={18} className="mr-3" />
                      <span>Saved Items</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#B983FF]/10 text-[#B983FF]' : 'hover:bg-gray-100'}`}
                    >
                      <SettingsIcon size={18} className="mr-3" />
                      <span>Account Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex-grow p-6">
              {activeTab === 'personal' && <Info />}
              {activeTab === 'orders' && <OrderHistory />}
              {activeTab === 'favorites' && <SaveProduct />}
              {activeTab === 'settings' && <AccountSetting />}
            </div>
          </div>
        </div>
  );
};

export default ProfilePage;

