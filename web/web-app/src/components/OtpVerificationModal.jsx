import React, { useEffect, useState } from 'react';
import { X, ArrowUpCircle } from 'lucide-react';

const OtpVerificationModal = ({
  isOpen,
  email,
  isLoading,
  errorMsg,
  successMsg,
  onClose,
  onVerify,
  onResend,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    setOtpCode('');
    setTimeLeft(60);
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    if (timeLeft > 0) return;
    onResend?.();
    setTimeLeft(60);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otpCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        <div className="relative flex items-center justify-center bg-[#26bc71] h-14 rounded-t-xl">
          <h3 className="text-white font-bold">Xác thực OTP</h3>
          <button onClick={onClose} className="absolute right-3 text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <p className="text-center text-sm text-gray-700">
            Nhập 4 chữ số được gửi đến: <strong>{email}</strong>
          </p>

          <input
            type="text"
            maxLength={4}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            className="mx-auto block w-40 text-center text-2xl tracking-[0.35em] border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#26bc71] text-slate-300"
            placeholder="____"
          />

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm text-center">{successMsg}</p>}

          <button
            type="submit"
            disabled={otpCode.length !== 4 || isLoading}
            className={`w-full rounded-md py-2 font-semibold text-white ${
              otpCode.length === 4 && !isLoading ? 'bg-[#26bc71] hover:bg-[#23a861]' : 'bg-gray-300 cursor-not-allowed'
            }`}>
            {isLoading ? 'Xác thực...' : 'Tiếp tục'}
          </button>

          <button
            type="button"
            className="w-full rounded-md border border-gray-300 py-2 text-sm flex items-center justify-center gap-1 text-slate-300"
            onClick={handleResend}
            disabled={timeLeft > 0 || isLoading}
          >
            {timeLeft > 0 ? `Gửi lại OTP sau ${timeLeft}s` : 'Gửi lại OTP'}
            <ArrowUpCircle size={16} />
          </button>

          <p className="text-xs text-gray-500">Lưu ý: kiểm tra hộp thư đến/spam (nếu dùng email thật).</p>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
