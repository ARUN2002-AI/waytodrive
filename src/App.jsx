import { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import OrdersTable from './components/OrdersTable';
import OrderHistory from './components/OrderHistory';

function App() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <main className="p-6">
          {/* WayToDrive Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-yellow-400">Way</span>
              <span className="text-white">To</span>
              <span className="text-green-400">Drive</span>
            </h1>
            <p className="text-purple-200">Delivery Partner Management System</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-yellow-500 text-purple-900'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              Delivered
            </button>
          </div>

          {/* Content */}
          {activeTab === 'orders' && <OrdersTable />}
          {activeTab === 'history' && <OrderHistory />}
        </main>
      </div>
    </OrderProvider>
  );
}

export default App;
