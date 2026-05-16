import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successImg from '../assets/payment_successed.png';
import failedImg from '../assets/payment_failed.png';

const PaymentCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const successChecks = {
    vnp_ResponseCode: '00',
    resultCode: '0'
  }
  const isSuccess = Object.keys(successChecks).some(key =>
    searchParams.has(key) && searchParams.get(key) === successChecks[key]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
      <div className="text-center p-8 bg-[#222] rounded-lg shadow-lg">
        <img
          src={isSuccess ? successImg : failedImg}
          alt={isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          className="mx-auto mb-6 w-32 h-32 object-contain"
        />
        <h1 className="text-2xl font-bold mb-4">
          {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </h1>
        <p className="text-sm opacity-75">
          {isSuccess ? 'Cảm ơn bạn đã thanh toán.' : 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
        </p>
        <p className="mt-4 text-xs opacity-60">Bạn sẽ được chuyển về trang chủ trong vài giây...</p>
      </div>
    </div>
  );
};

export default PaymentCallBack;
