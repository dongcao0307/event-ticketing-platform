const TicketOrderInfo = ({ ticket }) => {
  return (
    <div>

      <div className="p-4 border-b border-gray-600 text-white font-semibold">
        Đơn hàng #{ticket.orderCode}
      </div>

      <div className="grid grid-cols-3 text-sm text-gray-200">

        <div className="p-4 border-r border-gray-600">
          <div className="text-gray-400">
            Ngày tạo đơn
          </div>

          <div>
            {ticket.orderDate}
          </div>
        </div>

        <div className="p-4 border-r border-gray-600">
          <div className="text-gray-400">
            Phương thức thanh toán
          </div>

          <div>
            {ticket.payment}
          </div>
        </div>

        <div className="p-4">
          <div className="text-gray-400">
            Tình trạng đơn hàng
          </div>

          <div className="text-green-400">
            {ticket.status}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TicketOrderInfo;