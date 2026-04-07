import { QRCodeSVG } from "qrcode.react";

const TicketDetailHeader = ({ ticket }) => {
  return (
    <div className="p-5">

      {/* TITLE */}
      <div className="text-white font-semibold mb-4">
        {ticket.title}
      </div>

      {/* POSTER */}
      <img
        src={ticket.image}
        alt="event"
        className="rounded-md w-full mb-5"
      />

      {/* INFO */}
      <div className="flex justify-between items-start">

        <div>

          <div className="text-gray-400 text-sm">
            Loại vé
          </div>

          <div className="text-green-400 mb-4">
            {ticket.type}
          </div>

          <div className="text-gray-400 text-sm">
            Thời gian
          </div>

          <div className="text-green-400">
            {ticket.start} - {ticket.end}
          </div>

        </div>

        {/* QR */}
        <div className="text-center">

          <div className="text-green-400 text-sm mb-2">
            Vé trong tài khoản
          </div>

          <QRCodeSVG
            value={ticket.orderCode}
            size={80}
            bgColor="#ffffff"
          />

          <div className="text-gray-400 text-xs mt-1">
            Ticketbox để quét mã QR
          </div>

        </div>

      </div>

    </div>
  );
};

export default TicketDetailHeader;