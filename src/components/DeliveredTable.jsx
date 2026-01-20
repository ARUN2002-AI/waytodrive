import { useOrders } from '../context/OrderContext';
import { format } from 'date-fns';
import { getGoogleMapsUrl } from '../services/orderService';

function DeliveredTable() {
  const { orders, loading } = useOrders();

  // Filter to show only delivered orders
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-green-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-green-200 bg-green-50">
          <h2 className="text-lg font-semibold text-gray-800">Delivered Orders</h2>
        </div>
        <div className="px-6 py-12 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          Loading delivered orders...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-green-200 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-green-200 bg-green-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Delivered Orders ({deliveredOrders.length})
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Orders that have been successfully delivered
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-green-100 bg-green-50/50">
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
                Delivered At
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-green-50 hover:bg-green-50/50 transition-colors"
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
                <td className="px-6 py-4 text-sm">
                  {order.deliveredAt ? (
                    <span className="text-green-600 font-medium">{formatDate(order.deliveredAt)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white">
                    Delivered
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deliveredOrders.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No delivered orders yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveredTable;
