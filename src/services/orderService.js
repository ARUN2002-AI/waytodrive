import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection reference
const ordersCollection = collection(db, 'orders');

// Subscribe to real-time orders updates
export const subscribeToOrders = (callback, onError) => {
  // Simple query without orderBy to avoid index issues
  const unsubscribe = onSnapshot(
    ordersCollection,
    (snapshot) => {
      console.log('Firebase snapshot received:', snapshot.docs.length, 'documents');

      const orders = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        console.log('Order data:', docSnapshot.id, data);

        return {
          id: docSnapshot.id,
          orderNumber: docSnapshot.id.substring(0, 8).toUpperCase(),
          customerName: data.name || 'Unknown',
          customerPhone: data.phone || '',
          orderItem: formatOrderItems(data),
          deliveryAddress: formatAddress(data.userLocation, data.address),
          pickupAddress: data.pickupAddress || 'WayToForm Store',
          amount: data.total || data.price || 0,
          status: mapStatus(data.status),
          notes: data.notes || '',
          createdAt: formatTimestamp(data.createdAt),
          receivedAt: data.status !== 'pending' ? formatTimestamp(data.receivedAt || data.createdAt) : null,
          deliveredAt: data.status === 'delivered' ? formatTimestamp(data.deliveredAt) : null,
          updatedAt: formatTimestamp(data.updatedAt || data.createdAt),
          // Store original Firebase data for reference
          _firebaseData: data,
          _userLocation: data.userLocation
        };
      });

      // Sort by createdAt in JavaScript instead
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      callback(orders);
    },
    (error) => {
      console.error('Error fetching orders:', error);
      if (onError) onError(error);
      // Still call callback with empty array so loading stops
      callback([]);
    }
  );

  return unsubscribe;
};

// Format order items from Firebase data
const formatOrderItems = (data) => {
  // Check if there's an items array
  if (data.items && Array.isArray(data.items)) {
    return data.items.map(item =>
      `${item.name || item.productName || 'Item'}${item.quantity > 1 ? ` x${item.quantity}` : ''}${item.size ? ` (${item.size})` : ''}`
    ).join(', ');
  }
  // Check for single item data (based on your Firebase structure)
  if (data.name && data.quantity) {
    return `${data.name}${data.quantity > 1 ? ` x${data.quantity}` : ''}${data.size ? ` (${data.size})` : ''}`;
  }
  // Fallback
  return data.orderItem || data.productName || 'Order items';
};

// Format address from userLocation or address field
const formatAddress = (userLocation, address) => {
  if (address) return address;
  if (userLocation && userLocation.latitude && userLocation.longitude) {
    return `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`;
  }
  return 'Address not provided';
};

// Map Firebase status to our status
const mapStatus = (firebaseStatus) => {
  if (!firebaseStatus) return 'orders';

  const statusMap = {
    'pending': 'orders',
    'confirmed': 'orders',
    'processing': 'orders',
    'shipped': 'orders',
    'out_for_delivery': 'orders',
    'delivered': 'delivered',
    'cancelled': 'delivered'
  };
  return statusMap[firebaseStatus.toLowerCase()] || 'orders';
};

// Format Firebase Timestamp to ISO string
const formatTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toISOString();

  // Firebase Timestamp object
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }

  // Firebase Timestamp as plain object with seconds
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }

  // Already a string
  if (typeof timestamp === 'string') {
    return timestamp;
  }

  // Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  return new Date().toISOString();
};

// Update order status in Firebase
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const firebaseStatus = newStatus === 'delivered' ? 'delivered' : 'pending';

    const updateData = {
      status: firebaseStatus,
      updatedAt: Timestamp.now()
    };

    if (newStatus === 'delivered') {
      updateData.deliveredAt = Timestamp.now();
    }

    await updateDoc(orderRef, updateData);
    console.log('Order status updated successfully:', orderId, newStatus);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Get Google Maps URL from coordinates or address
export const getGoogleMapsUrl = (order) => {
  if (order._userLocation && order._userLocation.latitude && order._userLocation.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${order._userLocation.latitude},${order._userLocation.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`;
};
