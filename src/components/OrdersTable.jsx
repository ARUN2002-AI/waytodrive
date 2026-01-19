import { useOrders } from '../context/OrderContext';
import StatusDropdown from './StatusDropdown';
import { format } from 'date-fns';

function OrdersTable() {
  const { orders, updateOrderStatus } = useOrders();

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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white">
          Delivery Orders ({orders.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Delivery Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Order Received
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Order Delivered
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-purple-100 max-w-[200px] truncate">
                  {order.deliveryAddress}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {order.customerPhone}
                </td>
                <td className="px-6 py-4 text-sm text-purple-100">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.receivedAt ? (
                    <span className="text-blue-300">{formatDate(order.receivedAt)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.deliveredAt ? (
                    <span className="text-green-300">{formatDate(order.deliveredAt)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
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

        {orders.length === 0 && (
          <div className="px-6 py-12 text-center text-purple-200">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersTable;
