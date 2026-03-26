import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ShoppingCart, Zap } from 'lucide-react';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (!product) return;

    try {
      const cartRef = collection(db, 'users', currentUser.uid, 'cart');
      await addDoc(cartRef, {
        productId: product.id,
        quantity: 1,
        addedAt: serverTimestamp()
      });
      toast.success('Added to cart');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}/cart`);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Link to="/" className="text-blue-600 mt-4 inline-block hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-2/5 p-8 border-r border-gray-200 flex flex-col items-center">
            <div className="w-full h-96 relative mb-8">
              <img 
                src={product.imageUrl || 'https://picsum.photos/seed/product/800/800'} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex w-full space-x-4">
              <button 
                onClick={addToCart}
                className="flex-1 bg-orange-500 text-white py-4 rounded-sm font-medium flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                ADD TO CART
              </button>
              <button 
                className="flex-1 bg-orange-600 text-white py-4 rounded-sm font-medium flex items-center justify-center hover:bg-orange-700 transition-colors"
              >
                <Zap className="w-5 h-5 mr-2" />
                BUY NOW
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-3/5 p-8">
            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
            <h1 className="text-2xl font-medium text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-base font-medium text-green-600">{discount}% off</span>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-24">Stock:</span>
                <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
