import { createContext, useContext, useState, useCallback } from 'react';
import { initialOrders, initialHistory } from '../data/mockData';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  const [orderHistory, setOrderHistory] = useState(initialHistory);
  const [historyIdCounter, setHistoryIdCounter] = useState(initialHistory.length + 1);

  // Update order status and automatically add to history
  const updateOrderStatus = useCallback((orderId, newStatus, changeReason = '') => {
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) return prevOrders;

      const order = prevOrders[orderIndex];
      const previousStatus = order.status;

      // Don't update if status is the same
      if (previousStatus === newStatus) return prevOrders;

      // Create updated order with timestamps
      const now = new Date().toISOString();
      const updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: now,
        // Auto-set receivedAt when status is 'orders' (order received)
        receivedAt: newStatus === 'orders' && !order.receivedAt ? now : order.receivedAt,
        // Auto-set deliveredAt when status changes to delivered
        deliveredAt: newStatus === 'delivered' && !order.deliveredAt ? now : order.deliveredAt
      };

      // Add to order history
      const historyEntry = {
        id: historyIdCounter,
        orderId: order.id,
        orderNumber: order.orderNumber,
        previousStatus,
        newStatus,
        changedBy: 'Admin',
        changeReason,
        createdAt: new Date().toISOString()
      };

      setHistoryIdCounter(prev => prev + 1);
      setOrderHistory(prev => [historyEntry, ...prev]);

      // Return updated orders array
      const newOrders = [...prevOrders];
      newOrders[orderIndex] = updatedOrder;
      return newOrders;
    });
  }, [historyIdCounter]);

  // Refresh orders (simulate API call)
  const refreshOrders = useCallback(() => {
    // In a real app, this would fetch from API
    // For demo, we just trigger a re-render
    setOrders(prev => [...prev]);
  }, []);

  // Get history for specific order
  const getOrderHistory = useCallback((orderId) => {
    return orderHistory.filter(h => h.orderId === orderId);
  }, [orderHistory]);

  // Add new order
  const addOrder = useCallback((orderData) => {
    const now = new Date().toISOString();
    const newOrder = {
      id: orders.length + 1,
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      status: 'orders',
      createdAt: now,
      receivedAt: now,
      deliveredAt: null,
      updatedAt: now,
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, [orders.length]);

  const value = {
    orders,
    orderHistory,
    updateOrderStatus,
    refreshOrders,
    getOrderHistory,
    addOrder
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
