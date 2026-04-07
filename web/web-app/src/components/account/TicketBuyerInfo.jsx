const TicketBuyerInfo = ({ buyer }) => {
  return (
    <div className="p-4">

      <div className="text-white font-semibold mb-4">
        Thông tin người mua
      </div>

      <div className="grid grid-cols-2 text-sm text-gray-200">

        <div>
          <div className="text-gray-400">
            Tên
          </div>

          <div>
            {buyer.name}
          </div>
        </div>

        <div>
          <div className="text-gray-400">
            Email
          </div>

          <div>
            {buyer.email}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TicketBuyerInfo;