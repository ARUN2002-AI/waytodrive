import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { subscribeToOrders, updateOrderStatus as updateFirebaseStatus } from '../services/orderService';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyIdCounter, setHistoryIdCounter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to Firebase orders on mount
  useEffect(() => {
    console.log('Subscribing to Firebase orders...');
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToOrders(
      (firebaseOrders) => {
        console.log('Orders received:', firebaseOrders.length);
        setOrders(firebaseOrders);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firebase subscription error:', err);
        setError(err.message || 'Failed to load orders');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Unsubscribing from Firebase orders');
      unsubscribe();
    };
  }, []);

  // Update order status and automatically add to history
  const updateOrderStatus = useCallback(async (orderId, newStatus, changeReason = '') => {
    // Find the order
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const previousStatus = order.status;

    // Don't update if status is the same
    if (previousStatus === newStatus) return;

    // Update in Firebase
    const success = await updateFirebaseStatus(orderId, newStatus);

    if (success) {
      // Update local state immediately for better UX
      const now = new Date().toISOString();

      setOrders(prevOrders => {
        return prevOrders.map(o => {
          if (o.id === orderId) {
            return {
              ...o,
              status: newStatus,
              updatedAt: now,
              receivedAt: newStatus === 'orders' && !o.receivedAt ? now : o.receivedAt,
              deliveredAt: newStatus === 'delivered' && !o.deliveredAt ? now : o.deliveredAt
            };
          }
          return o;
        });
      });

      // Add to order history
      const historyEntry = {
        id: historyIdCounter,
        orderId: orderId,
        orderNumber: order.orderNumber,
        previousStatus,
        newStatus,
        changedBy: 'Admin',
        changeReason,
        createdAt: now
      };

      setHistoryIdCounter(prev => prev + 1);
      setOrderHistory(prev => [historyEntry, ...prev]);
    }
  }, [orders, historyIdCounter]);

  // Refresh orders (Firebase will auto-update, but this can force re-render)
  const refreshOrders = useCallback(() => {
    setOrders(prev => [...prev]);
  }, []);

  // Get history for specific order
  const getOrderHistory = useCallback((orderId) => {
    return orderHistory.filter(h => h.orderId === orderId);
  }, [orderHistory]);

  const value = {
    orders,
    orderHistory,
    updateOrderStatus,
    refreshOrders,
    getOrderHistory,
    loading,
    error
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
