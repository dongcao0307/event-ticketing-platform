const CancelTicketModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-[520px] rounded-lg overflow-hidden shadow-lg">

        {/* header */}
        <div className="bg-green-500 text-white text-center text-3xl font-semibold py-6 relative">

          Hủy vé

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white text-xl"
          >
            ✕
          </button>

        </div>

        {/* body */}
        <div className="p-8 text-gray-700 text-center">

          Nếu bạn hủy vé trước thời điểm diễn ra sự kiện 24 giờ sẽ không được hoàn tiền.
          Bạn chắc chắn muốn hủy vé chứ?

        </div>

        {/* footer */}
        <div className="flex justify-end p-4 bg-gray-100">

          <button
            onClick={onConfirm}
            className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded"
          >
            Xác nhận
          </button>

        </div>

      </div>
    </div>
  );
};

export default CancelTicketModal;