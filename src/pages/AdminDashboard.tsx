import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { name: 'Total Revenue', value: '₹45,231.89', icon: DollarSign, change: '+20.1%' },
    { name: 'Orders', value: '+573', icon: ShoppingBag, change: '+201 since last month' },
    { name: 'Products', value: '124', icon: Package, change: '+12 new products' },
    { name: 'Active Users', value: '+2350', icon: Users, change: '+180 since last month' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
