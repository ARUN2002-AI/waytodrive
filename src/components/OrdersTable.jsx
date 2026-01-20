import { useOrders } from '../context/OrderContext';
import StatusDropdown from './StatusDropdown';
import { format } from 'date-fns';
import { getGoogleMapsUrl } from '../services/orderService';

function OrdersTable() {
  const { orders, updateOrderStatus, loading } = useOrders();

  // Filter to show only orders with status 'orders' (not delivered)
  const pendingOrders = orders.filter(order => order.status === 'orders');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-yellow-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-yellow-200 bg-yellow-50">
          <h2 className="text-lg font-semibold text-gray-800">Pending Orders</h2>
        </div>
        <div className="px-6 py-12 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          Loading orders from Firebase...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-yellow-200 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-yellow-200 bg-yellow-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Orders ({pendingOrders.length})
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real-time orders from WayToForm app
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-yellow-100 bg-yellow-50/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Order Item
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Delivery Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-yellow-50 hover:bg-yellow-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px]">
                  {order.orderItem || '-'}
                </td>
                <td className="px-6 py-4 text-sm max-w-[200px]">
                  <a
                    href={getGoogleMapsUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {order.deliveryAddress}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                  >
                    {order.customerPhone}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  ₹{order.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <StatusDropdown
                    currentStatus={order.status}
                    onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pendingOrders.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No pending orders. All orders have been delivered!
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersTable;
