import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successImg from '../assets/payment_successed.png';
import failedImg from '../assets/payment_failed.png';
import { serviceSavePaymentCallback } from '../services/paymentService';

const PaymentCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submittedRef = useRef(false);
  const [callbackStatus, setCallbackStatus] = useState('Đang ghi nhận thông tin thanh toán...');
  const successChecks = {
    vnp_ResponseCode: '00',
    resultCode: '0'
  }
  const isSuccess = Object.keys(successChecks).some(key =>
    searchParams.has(key) && searchParams.get(key) === successChecks[key]
  );

  const buildQueryParamsObject = () => Object.fromEntries(searchParams.entries());

  const detectProvider = (queryParams) => {
    if (Object.keys(queryParams).some((key) => key.startsWith('vnp_'))) {
      return 'VNPAY';
    }
    if (queryParams.partnerCode || queryParams.resultCode) {
      return 'MOMO';
    }
    return 'UNKNOWN';
  };

  const resolvePaymentReference = (queryParams) => queryParams.orderId || queryParams.vnp_TxnRef || null;
  const resolveProviderTransactionId = (queryParams) => queryParams.transId || queryParams.vnp_TransactionNo || null;

  useEffect(() => {
    if (submittedRef.current) {
      return;
    }

    const queryParams = buildQueryParamsObject();
    if (Object.keys(queryParams).length === 0) {
      setCallbackStatus('Khong co du lieu callback de luu.');
      submittedRef.current = true;
      return;
    }

    submittedRef.current = true;
    setCallbackStatus('Dang luu callback giao dich...');

    void serviceSavePaymentCallback({
      sourcePath: '/payment/call-back',
      callbackUrl: window.location.href,
      provider: detectProvider(queryParams),
      paymentReference: resolvePaymentReference(queryParams),
      providerTransactionId: resolveProviderTransactionId(queryParams),
      rawQueryString: searchParams.toString(),
      queryParams,
    }).then(() => {
      setCallbackStatus('Da luu thong tin thanh toan.');
    }).catch(() => {
      setCallbackStatus('Khong luu duoc callback, nhung trang se tiep tuc chuyen huong.');
    });
  }, [searchParams]);

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
        <p className="mt-3 text-xs opacity-60">{callbackStatus}</p>
        <p className="mt-4 text-xs opacity-60">Bạn sẽ được chuyển về trang chủ trong vài giây...</p>
      </div>
    </div>
  );
};

export default PaymentCallBack;
