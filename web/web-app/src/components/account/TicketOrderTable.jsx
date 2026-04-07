const TicketOrderTable = ({ tickets }) => {

  const subtotal = tickets.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );

  return (
    <div>

      <div className="p-4 border-b border-gray-600 text-white font-semibold">
        Thông tin đơn hàng
      </div>

      <table className="w-full text-sm text-gray-200">

        <thead className="text-gray-400 border-b border-gray-600">
          <tr>

            <th className="p-3 text-left">
              Loại vé
            </th>

            <th className="p-3 text-center">
              Số lượng
            </th>

            <th className="p-3 text-center">
              Thành tiền
            </th>

          </tr>
        </thead>

        <tbody>

          {tickets.map((t, i) => (
            <tr
              key={i}
              className="border-b border-gray-700"
            >

              <td className="p-3">
                {t.name}
              </td>

              <td className="text-center">
                {t.quantity}
              </td>

              <td className="text-center">
                {t.price} đ
              </td>

            </tr>
          ))}

          {/* Subtotal */}
          <tr className="border-b border-gray-700">
            <td className="p-3 font-semibold">
              Tổng tạm tính
            </td>

            <td />

            <td className="text-center">
              {subtotal} đ
            </td>
          </tr>

          {/* Total */}
          <tr>
            <td className="p-3 font-semibold">
              Tổng tiền
            </td>

            <td />

            <td className="text-center text-green-400 font-semibold">
              {subtotal} đ
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  );
};

export default TicketOrderTable;