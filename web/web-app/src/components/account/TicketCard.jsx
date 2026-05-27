import React from "react";

const statusConfig = {
  PAID: {
    label: "Thành công",
    color: "bg-green-600",
  },
  PENDING: {
    label: "Đang xử lý",
    color: "bg-yellow-500",
  },
  CANCEL: {
    label: "Đã hủy",
    color: "bg-red-600",
  },
};

const formatDateParts = (dateStr) => {
  const d = new Date(dateStr);

  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
};

const TicketCard = ({ ticket, rawBooking, onCardClick, onPaymentClick, openCancelModal }) => {
  const start = formatDateParts(ticket.startDate);

  const isPast = new Date(ticket.startDate) < new Date();

  const hideCancel =
    ticket.status === "cancel" || isPast;

  const handleCardClick = () => {
    onCardClick(rawBooking);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex bg-[#3a3c40] border border-[#4a4c50] rounded-lg overflow-hidden cursor-pointer hover:border-[#26bc71] transition"
    >

      {/* DATE */}
      <div className="w-20 bg-[#2e3034] flex flex-col items-center justify-center text-center text-sm text-gray-200 border-r border-[#4a4c50]">

        <div className="text-xl font-bold">{start.day}</div>

        <div className="text-xs text-gray-400">Tháng</div>

        <div>{start.month}</div>

        <div className="text-xs text-gray-400">{start.year}</div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4">

        <h3 className="font-semibold text-white text-sm">
          {ticket.title}
        </h3>

        <div className="flex items-center gap-2 mt-2">

          <span
            className={`text-xs px-2 py-1 rounded text-white ${statusConfig[ticket.status]?.color || 'bg-gray-500'}`}
          >
            {statusConfig[ticket.status]?.label || ticket.status}
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-300 space-y-1">

          <div>
            Order code: {ticket.order}
          </div>

          <div>
            {ticket.time}
          </div>

          <div>
            {ticket.location}
          </div>

        </div>

      </div>

      {/* ACTION */}
      <div className="flex items-center pr-4 gap-4">
        {ticket.status === "PENDING" && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Ngừng propagation để không trigger card click
              onPaymentClick(rawBooking);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Tiếp tục thanh toán
          </button>
        )}
        {ticket.status === "PAID" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (typeof openCancelModal === 'function') {
                openCancelModal(rawBooking);
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Hủy vé
          </button>
        )}
      </div>


    </div>
  );
};

export default TicketCard;