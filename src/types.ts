export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any; // Firebase Timestamp
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: any; // Firebase Timestamp
}

export interface CartItem {
  id: string; // The document ID in the subcollection
  productId: string;
  quantity: number;
  addedAt: any; // Firebase Timestamp
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: any; // Firebase Timestamp
}
