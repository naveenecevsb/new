import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6" />
          <Link to="/" className="flex items-center justify-center bg-white text-blue-800 rounded-full h-9 w-9 font-bold text-xs border-2 border-yellow-400 shadow-sm">
            SK
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Heart className="h-6 w-6" />
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-sm leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white sm:text-sm"
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
}
