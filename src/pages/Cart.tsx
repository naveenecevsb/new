import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { CartItem, Product } from '../types';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function Cart() {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<(CartItem & { product?: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'users', currentUser.uid, 'cart'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CartItem[];

        // Fetch product details for each cart item
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const productDoc = await getDoc(doc(db, 'products', item.productId));
            return {
              ...item,
              product: productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } as Product : undefined
            };
          })
        );

        setCartItems(itemsWithProducts.filter(item => item.product)); // Filter out items where product was deleted
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/cart`);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/cart`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateQuantity = async (id: string, newQuantity: number, productId: string) => {
    if (!currentUser) return;
    if (newQuantity < 1) return;
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'cart', id), {
        quantity: newQuantity,
        productId: productId // needed for rules
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}/cart/${id}`);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'cart', id));
      toast.success('Item removed from cart');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/cart/${id}`);
      toast.error('Failed to remove item');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const totalOriginalAmount = cartItems.reduce((sum, item) => sum + (item.product?.originalPrice || 0) * item.quantity, 0);
  const totalDiscount = totalOriginalAmount - totalAmount;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-8 text-center shadow-sm rounded-sm">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Missing Cart items?</h2>
            <p className="text-gray-500 mb-6">Login to see the items you added previously</p>
            <button className="bg-orange-500 text-white px-8 py-2 rounded-sm font-medium">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-8 text-center shadow-sm rounded-sm">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-64 mx-auto mb-6" referrerPolicy="no-referrer" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-6">Add items to it now.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-2 rounded-sm font-medium inline-block">Shop Now</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">My Cart ({cartItems.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-32 sm:h-32 flex-shrink-0 mb-4 sm:mb-0">
                        <img src={item.product?.imageUrl} alt={item.product?.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="sm:ml-6 flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{item.product?.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Category: {item.product?.category}</p>
                            <div className="mt-2 flex items-baseline space-x-2">
                              <span className="text-sm text-gray-500 line-through">₹{item.product?.originalPrice.toLocaleString()}</span>
                              <span className="text-lg font-bold text-gray-900">₹{item.product?.price.toLocaleString()}</span>
                              <span className="text-sm font-medium text-green-600">
                                {Math.round((((item.product?.originalPrice || 0) - (item.product?.price || 0)) / (item.product?.originalPrice || 1)) * 100)}% off
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-6">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.productId)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center border border-gray-300 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.productId)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-base font-medium text-gray-900 hover:text-blue-600 flex items-center"
                          >
                            <Trash2 className="w-5 h-5 mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end sticky bottom-0">
                  <button className="bg-orange-500 text-white px-10 py-3 rounded-sm font-medium text-lg hover:bg-orange-600 transition-colors shadow-sm">
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="lg:w-96">
              <div className="bg-white shadow-sm rounded-sm sticky top-20">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-gray-500 font-medium uppercase text-sm tracking-wide">Price Details</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-base text-gray-900">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{totalOriginalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base text-green-600">
                    <span>Discount</span>
                    <span>- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-900">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-green-600 font-medium text-sm pt-2">
                    You will save ₹{totalDiscount.toLocaleString()} on this order
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
