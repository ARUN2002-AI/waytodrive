import { useOrders } from '../context/OrderContext';
import { format } from 'date-fns';
import { statusOptions } from '../data/mockData';

function OrderHistory() {
  const { orderHistory } = useOrders();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy, HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white">
          Order History ({orderHistory.length})
        </h2>
        <p className="text-sm text-purple-200 mt-1">
          Automatic log of all status changes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Previous Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                New Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Changed By
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Reason
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {entry.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.previousStatus)}`}>
                    {getStatusLabel(entry.previousStatus)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.newStatus)}`}>
                    {getStatusLabel(entry.newStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {entry.changedBy}
                </td>
                <td className="px-6 py-4 text-sm text-purple-100">
                  {entry.changeReason || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-purple-100">
                  {formatDate(entry.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orderHistory.length === 0 && (
          <div className="px-6 py-12 text-center text-purple-200">
            No history yet. Status changes will appear here automatically.
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
