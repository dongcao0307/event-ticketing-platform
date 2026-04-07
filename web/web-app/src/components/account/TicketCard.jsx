import React from "react";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  success: {
    label: "Thành công",
    color: "bg-green-600",
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-yellow-500",
  },
  cancel: {
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

const TicketCard = ({ ticket, openCancelModal }) => {
  const navigate = useNavigate();
  const start = formatDateParts(ticket.startDate);

  const isPast = new Date(ticket.startDate) < new Date();

  const hideCancel =
    ticket.status === "cancel" || isPast;

  return (
    <div
      // onClick={() => navigate(`/ticket/${ticket.id}`)}
      className="flex bg-[#3a3c40] border border-[#4a4c50] rounded-lg overflow-hidden cursor-pointer hover:border-[#26bc71]"
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
            className={`text-xs px-2 py-1 rounded text-white ${statusConfig[ticket.status].color}`}
          >
            {statusConfig[ticket.status].label}
          </span>

          {ticket.isElectronic && (
            <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">
              Vé điện tử
            </span>
          )}

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
        <button
          onClick={() => navigate(`/ticket/${ticket.id}`)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Xem chi tiết
        </button>
        {!hideCancel && (
          <button
            onClick={openCancelModal}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Hủy vé
          </button>
        )}
      </div>


    </div>
  );
};

export default TicketCard;