import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { currentUser } = useAuth();

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      return;
    }

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

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="relative pt-[100%] bg-gray-50">
        <img
          src={product.imageUrl || 'https://picsum.photos/seed/product/400/400'}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-sm font-medium text-green-600">{discount}% off</span>
            </>
          )}
        </div>
        <button
          onClick={addToCart}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
