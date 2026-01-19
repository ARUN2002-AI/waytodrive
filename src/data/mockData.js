// Mock data for Delivery Partner system

export const initialOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    pickupAddress: '123 MG Road, Bengaluru',
    deliveryAddress: '456 Koramangala, Bengaluru',
    amount: 450.00,
    deliveryFee: 50.00,
    status: 'orders',
    notes: 'Handle with care',
    createdAt: '2026-01-15T10:30:00',
    receivedAt: '2026-01-15T10:30:00',
    deliveredAt: null,
    updatedAt: '2026-01-15T10:30:00'
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'Priya Patel',
    customerPhone: '9123456780',
    pickupAddress: '789 Brigade Road, Bengaluru',
    deliveryAddress: '321 Indiranagar, Bengaluru',
    amount: 850.00,
    deliveryFee: 60.00,
    status: 'orders',
    notes: '',
    createdAt: '2026-01-15T11:00:00',
    receivedAt: '2026-01-15T11:15:00',
    deliveredAt: null,
    updatedAt: '2026-01-15T11:15:00'
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'Amit Kumar',
    customerPhone: '8765432190',
    pickupAddress: '555 HSR Layout, Bengaluru',
    deliveryAddress: '777 Whitefield, Bengaluru',
    amount: 1200.00,
    deliveryFee: 80.00,
    status: 'orders',
    notes: 'Call before delivery',
    createdAt: '2026-01-15T09:00:00',
    receivedAt: '2026-01-15T09:30:00',
    deliveredAt: null,
    updatedAt: '2026-01-15T10:00:00'
  },
  {
    id: 4,
    orderNumber: 'ORD-004',
    customerName: 'Sneha Reddy',
    customerPhone: '7654321098',
    pickupAddress: '999 Electronic City, Bengaluru',
    deliveryAddress: '111 JP Nagar, Bengaluru',
    amount: 320.00,
    deliveryFee: 45.00,
    status: 'delivered',
    notes: '',
    createdAt: '2026-01-14T14:00:00',
    receivedAt: '2026-01-14T14:30:00',
    deliveredAt: '2026-01-14T16:30:00',
    updatedAt: '2026-01-14T16:30:00'
  },
  {
    id: 5,
    orderNumber: 'ORD-005',
    customerName: 'Vikram Singh',
    customerPhone: '6543210987',
    pickupAddress: '222 Marathahalli, Bengaluru',
    deliveryAddress: '444 BTM Layout, Bengaluru',
    amount: 680.00,
    deliveryFee: 55.00,
    status: 'orders',
    notes: 'Fragile items',
    createdAt: '2026-01-15T12:00:00',
    receivedAt: '2026-01-15T12:00:00',
    deliveredAt: null,
    updatedAt: '2026-01-15T12:00:00'
  }
];

export const initialHistory = [
  {
    id: 1,
    orderId: 4,
    orderNumber: 'ORD-004',
    previousStatus: 'orders',
    newStatus: 'delivered',
    changedBy: 'Admin',
    changeReason: 'Delivered successfully',
    createdAt: '2026-01-14T16:30:00'
  }
];

export const statusOptions = [
  { value: 'orders', label: 'Orders', color: 'bg-yellow-500 text-black' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-500 text-white' }
];
