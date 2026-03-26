import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Shirt, Smartphone, Monitor, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { name: 'Fashion', icon: Shirt },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Electronics', icon: Monitor },
    { name: 'Beauty', icon: Sparkles },
  ];

  const deals = [
    { title: 'Top Offers', subtitle: 'Up to 80% Off' },
    { title: 'Phones & Tablets', subtitle: 'From ₹6,999' },
    { title: 'Electronics', subtitle: 'Up to 50% Off' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto">
        {/* Categories */}
        <div className="bg-white py-4 px-2 flex justify-between overflow-x-auto hide-scrollbar border-b border-gray-200">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="flex flex-col items-center min-w-[80px]">
                <Icon className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-xs font-medium text-gray-800">{cat.name}</span>
              </div>
            );
          })}
        </div>

        {/* Hero Banner */}
        <div className="relative bg-emerald-400 h-40 sm:h-64 w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/kitchen/1000/500')] bg-cover bg-center mix-blend-overlay"></div>
          <button className="absolute left-2 bg-white/80 p-1 rounded-full shadow-md z-10">
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <div className="text-center z-10 px-12">
            <h2 className="text-white text-2xl sm:text-4xl font-black tracking-wider drop-shadow-md">HOME ESSENTIALS</h2>
            <h3 className="text-white text-4xl sm:text-6xl font-black tracking-widest drop-shadow-lg mt-1">SALE</h3>
            <button className="mt-4 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-sm">SHOP NOW</button>
          </div>
          <button className="absolute right-2 bg-white/80 p-1 rounded-full shadow-md z-10">
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 py-3 bg-white">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        </div>

        {/* Deals of the Day */}
        <div className="bg-white mt-2 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-yellow-500 fill-current" />
            <h2 className="text-xl font-bold text-gray-900">Deals of the Day</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
            {deals.map((deal, idx) => (
              <div key={idx} className="min-w-[140px] bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-100">
                <h3 className="font-bold text-sm text-gray-900">{deal.title}</h3>
                <p className="text-green-600 font-medium text-xs mt-1">{deal.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white mt-2 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
