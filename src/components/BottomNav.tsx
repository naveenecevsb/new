import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5 z-40 pb-safe">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-[#1d5bb6]' : 'text-[#687182]'}`}>
        <Home className="h-6 w-6 stroke-[2]" />
        <span className="text-[11px] mt-1 font-medium">Home</span>
      </Link>
      <Link to="/categories" className={`flex flex-col items-center ${location.pathname === '/categories' ? 'text-[#1d5bb6]' : 'text-[#687182]'}`}>
        <LayoutGrid className="h-6 w-6 stroke-[2]" />
        <span className="text-[11px] mt-1 font-medium">Categories</span>
      </Link>
      <Link to="/account" className={`flex flex-col items-center ${location.pathname === '/account' ? 'text-[#1d5bb6]' : 'text-[#687182]'}`}>
        <User className="h-6 w-6 stroke-[2]" />
        <span className="text-[11px] mt-1 font-medium">Account</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center ${location.pathname === '/cart' ? 'text-[#1d5bb6]' : 'text-[#687182]'}`}>
        <div className="relative">
          <ShoppingCart className="h-6 w-6 stroke-[2]" />
          <span className="absolute -top-1.5 -right-2 bg-[#e84d54] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">1</span>
        </div>
        <span className="text-[11px] mt-1 font-medium">Cart</span>
      </Link>
    </div>
  );
}
