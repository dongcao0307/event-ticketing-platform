import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Clock3, MapPin, Ticket } from 'lucide-react';
import Header from '../components/Header';
import { useEvent } from '../hooks/useEvent';
import { serviceGetOrderById } from '../services/bookingService';
import { serviceGetMomoPaymentStatus, serviceGetVnPayPaymentStatus } from '../services/paymentService';

const PAYMENT_METHODS = [
  { value: 'MOMO', label: 'MoMo (Thanh toan tren web)' },
  { value: 'VNPAY', label: 'VNPAY/Ung dung ngan hang' },
];

const formatPrice = (value) => Number(value || 0).toLocaleString('vi-VN') + ' đ';

const toSecondsLeft = (expiredAt) => {
  if (!expiredAt) return 0;
  const milliseconds = new Date(expiredAt).getTime() - Date.now();
  return Math.max(0, Math.floor(milliseconds / 1000));
};

const formatTimer = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return { mins, secs };
};

const PAYMENT_STORAGE_KEY_PREFIX = 'booking-payment-';

const normalizeProvider = (provider) => {
  const normalized = String(provider || '').toUpperCase();
  return normalized === 'MOMO' || normalized === 'VNPAY' ? normalized : null;
};

const buildPaymentStorageKey = (orderId) => `${PAYMENT_STORAGE_KEY_PREFIX}${orderId}`;

const BookingPaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId');
  const paymentIdFromQuery = searchParams.get('paymentId');
  const paymentProviderFromQuery = normalizeProvider(searchParams.get('provider'));

  const {
    bookingOrder,
    bookingOrderItems,
    bookingCheckoutContext,
    createVnPayCheckout,
    createMomoCheckout,
    bookingPayment,
  } = useEvent();

  const [order, setOrder] = useState(bookingOrder);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    normalizeProvider(bookingPayment?.provider) || paymentProviderFromQuery || 'MOMO'
  );
  const [countdownSec, setCountdownSec] = useState(toSecondsLeft(bookingOrder?.expiredAt));
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPaymentStatus, setCheckingPaymentStatus] = useState(false);

  useEffect(() => {
    const preferredProvider = normalizeProvider(bookingPayment?.provider) || paymentProviderFromQuery;
    if (preferredProvider) {
      setSelectedPaymentMethod(preferredProvider);
    }
  }, [bookingPayment?.provider, paymentProviderFromQuery]);

  useEffect(() => {
    if (bookingOrder) {
      setOrder(bookingOrder);
      setCountdownSec(toSecondsLeft(bookingOrder.expiredAt));
    }
  }, [bookingOrder]);

  useEffect(() => {
    const canReuseStoreOrder =
      bookingOrder &&
      (!orderIdFromQuery || String(bookingOrder.id) === String(orderIdFromQuery));

    if (canReuseStoreOrder) {
      return;
    }

    if (!orderIdFromQuery) {
      setLoadError('Khong tim thay ma don hang.');
      return;
    }

    const loadOrder = async () => {
      setLoadingOrder(true);
      setLoadError('');
      try {
        const data = await serviceGetOrderById(orderIdFromQuery);
        setOrder(data);
        setCountdownSec(toSecondsLeft(data?.expiredAt));
      } catch (error) {
        setLoadError(error?.response?.data?.message || 'Khong tai duoc don hang.');
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [bookingOrder, orderIdFromQuery]);

  useEffect(() => {
    if (!order?.expiredAt) return undefined;

    const timer = setInterval(() => {
      setCountdownSec((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.expiredAt]);

  const timerParts = useMemo(() => formatTimer(countdownSec), [countdownSec]);
  const isExpired = countdownSec <= 0 || order?.status === 'EXPIRED' || order?.status === 'CANCELLED';

  const orderItems = useMemo(() => {
    if (bookingOrderItems?.length) return bookingOrderItems;
    return order?.items?.map((item) => ({
      ticketTypeId: item.ticketTypeId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [];
  }, [bookingOrderItems, order]);

  const event = bookingCheckoutContext?.event;
  const showtime = bookingCheckoutContext?.showtime;

  useEffect(() => {
    if (!order?.id) return;

    const resolvePaymentContext = () => {
      const fromStore = bookingPayment?.response?.paymentId;
      const storeProvider = normalizeProvider(bookingPayment?.provider);
      if (fromStore) {
        const parsedStoreId = Number(fromStore);
        if (Number.isFinite(parsedStoreId) && parsedStoreId > 0) {
          return {
            paymentId: parsedStoreId,
            provider: storeProvider || 'VNPAY',
          };
        }
      }

      if (paymentIdFromQuery) {
        const parsedQueryId = Number(paymentIdFromQuery);
        if (Number.isFinite(parsedQueryId) && parsedQueryId > 0) {
          return {
            paymentId: parsedQueryId,
            provider: paymentProviderFromQuery || 'VNPAY',
          };
        }
      }

      const rawStored = localStorage.getItem(buildPaymentStorageKey(order.id));
      if (!rawStored) return null;

      try {
        const parsed = JSON.parse(rawStored);
        const parsedId = Number(parsed?.paymentId);
        if (Number.isFinite(parsedId) && parsedId > 0) {
          return {
            paymentId: parsedId,
            provider: normalizeProvider(parsed?.provider) || 'VNPAY',
          };
        }
      } catch {
        return null;
      }

      return null;
    };

    const paymentContext = resolvePaymentContext();
    if (!paymentContext?.paymentId) return;

    let active = true;

    const checkStatus = async () => {
      try {
        setCheckingPaymentStatus(true);
        const getStatusService = paymentContext.provider === 'MOMO'
          ? serviceGetMomoPaymentStatus
          : serviceGetVnPayPaymentStatus;
        const statusResponse = await getStatusService(paymentContext.paymentId);
        if (!active) return;
        setPaymentStatus(statusResponse);

        if (statusResponse?.status === 'COMPLETED') {
          setPaymentError('');
          localStorage.removeItem(buildPaymentStorageKey(order.id));
        }
      } catch {
        if (!active) return;
      } finally {
        if (active) {
          setCheckingPaymentStatus(false);
        }
      }
    };

    checkStatus();

    const pollTimer = setInterval(() => {
      if (document.hidden) return;
      checkStatus();
    }, 3000);

    return () => {
      active = false;
      clearInterval(pollTimer);
    };
  }, [order?.id, bookingPayment?.response?.paymentId, bookingPayment?.provider, paymentIdFromQuery, paymentProviderFromQuery]);

  const handlePay = () => {
    if (isExpired || paying) return;
    if (selectedPaymentMethod !== 'VNPAY' && selectedPaymentMethod !== 'MOMO') {
      setPaymentError('Hien tai chi ho tro thanh toan VNPay va MoMo.');
      return;
    }

    const run = async () => {
      try {
        setPaymentError('');
        setPaying(true);

        const returnUrl = `${window.location.origin}/event/${id}/payment?orderId=${order.id}&provider=${selectedPaymentMethod}`;
        const checkout = selectedPaymentMethod === 'MOMO'
          ? await createMomoCheckout({
              order,
              event,
              showtime,
              returnUrl,
            })
          : await createVnPayCheckout({
              order,
              event,
              showtime,
              returnUrl,
            });

        if (checkout?.paymentId) {
          localStorage.setItem(
            buildPaymentStorageKey(order.id),
            JSON.stringify({
              paymentId: checkout.paymentId,
              provider: selectedPaymentMethod,
              createdAt: new Date().toISOString(),
            })
          );
        }

        if (!checkout?.paymentUrl) {
          throw new Error('Khong nhan duoc paymentUrl tu backend payment-service.');
        }

        window.location.href = checkout.paymentUrl;
      } catch (error) {
        setPaymentError(
          error?.response?.data?.message
            || error?.message
            || (selectedPaymentMethod === 'MOMO'
              ? 'Tao giao dich MoMo that bai.'
              : 'Tao giao dich VNPay that bai.')
        );
      } finally {
        setPaying(false);
      }
    };

    run();
  };

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        Dang tai thong tin don hang...
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-3 px-4">
        <div>{loadError || 'Khong tim thay don hang.'}</div>
        <button
          onClick={() => navigate(`/event/${id}`)}
          className="px-4 py-2 rounded-lg bg-[#26bc71] hover:bg-[#1fa86a] transition"
        >
          Quay lai su kien
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-6 pb-10">
        <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-gradient-to-r from-[#2c0f15] via-[#131f2f] to-[#101522] p-6 mb-6">
          <h1 className="text-2xl font-bold leading-tight">{event?.title || 'Thanh toan don hang'}</h1>

          {showtime && (
            <div className="mt-4 space-y-1 text-gray-200 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={15} />
                <span>{showtime.label}, {showtime.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} />
                <span>{event?.location}</span>
              </div>
            </div>
          )}

          <div className="absolute right-5 top-5 bg-[#2d3441]/90 border border-[#4b5563] rounded-xl px-4 py-3 text-center">
            <div className="text-xs text-gray-200 mb-2">Hoan tat dat ve trong</div>
            <div className="flex items-center gap-2 justify-center">
              <span className="bg-[#ff485d] text-white px-3 py-2 rounded-2xl text-xl font-bold min-w-14">{timerParts.mins}</span>
              <span className="text-white text-2xl font-bold">:</span>
              <span className="bg-[#ff485d] text-white px-3 py-2 rounded-2xl text-xl font-bold min-w-14">{timerParts.secs}</span>
            </div>
          </div>
        </div>

        <h2 className="text-[#26bc71] text-2xl font-extrabold tracking-wide mb-4">THANH TOAN</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="space-y-4">
            <section className="bg-[#2f313b] rounded-xl p-4 border border-[#3d404b]">
              <h3 className="font-semibold text-[#26bc71] mb-2">Thong tin nhan ve</h3>
              <p className="text-sm text-gray-200">
                Ve dien tu se duoc hien thi trong muc "Ve cua toi" cua tai khoan.
              </p>
              <p className="text-sm text-gray-300 mt-1">{bookingCheckoutContext?.buyer?.email || 'Ban chua nhap email'}</p>
            </section>

            <section className="bg-[#2f313b] rounded-xl p-4 border border-[#3d404b]">
              <h3 className="font-semibold text-[#26bc71] mb-3">Phuong thuc thanh toan</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.value} className="flex items-center gap-3 cursor-pointer text-gray-100">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="accent-[#26bc71]"
                      checked={selectedPaymentMethod === method.value}
                      onChange={() => setSelectedPaymentMethod(method.value)}
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-3">
            <section className="bg-white rounded-xl p-4 text-[#1f2937]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Thong tin dat ve</h3>
                <button
                  onClick={() => navigate(`/event/${id}`)}
                  className="text-[#3b82f6] text-sm hover:underline"
                >
                  Chon lai ve
                </button>
              </div>

              <div className="grid grid-cols-[1fr_auto] text-xs font-semibold text-gray-500 uppercase mb-2">
                <span>Loai ve</span>
                <span>So luong</span>
              </div>

              <div className="space-y-2">
                {orderItems.map((item, idx) => (
                  <div key={`${item.ticketTypeId}-${idx}`} className="grid grid-cols-[1fr_auto] gap-2 border-b border-gray-100 pb-2">
                    <div className="text-sm">
                      <div className="font-medium">Ticket #{item.ticketTypeId}</div>
                      <div className="text-gray-500">{formatPrice(item.unitPrice || 0)}</div>
                    </div>
                    <div className="text-sm text-gray-600">{item.quantity}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl p-4 text-[#1f2937]">
              <h3 className="font-bold mb-2">Thong tin don hang</h3>
              {bookingPayment?.response?.paymentId && (
                <div className="text-xs text-gray-500 mb-2">
                  Payment ID: {bookingPayment.response.paymentId}
                </div>
              )}

              {paymentStatus?.paymentId && (
                <div className="text-xs text-gray-500 mb-2">
                  Payment status: {paymentStatus.status}
                </div>
              )}

              {checkingPaymentStatus && (
                <div className="text-xs text-blue-600 mb-2">Dang dong bo trang thai thanh toan...</div>
              )}

              {paymentStatus?.status === 'COMPLETED' && (
                <div className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  Thanh toan thanh cong.
                </div>
              )}

              {paymentStatus?.status === 'FAILED' && (
                <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  Thanh toan that bai. Vui long thu lai.
                </div>
              )}
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Tam tinh</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Giam gia</span>
                <span>{formatPrice(order.discountAmount)}</span>
              </div>
              <div className="border-t border-dashed my-2" />
              <div className="flex justify-between text-base font-bold py-1">
                <span>Tong tien</span>
                <span className="text-[#26bc71]">{formatPrice(order.totalAmount)}</span>
              </div>

              {isExpired && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  Don hang da het han thanh toan.
                </div>
              )}

              {paymentError && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {paymentError}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isExpired || paying || paymentStatus?.status === 'COMPLETED'}
                className="mt-3 w-full py-2.5 bg-[#26bc71] text-white font-bold rounded-lg hover:bg-[#1fa86a] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Ticket size={16} />
                {paying
                  ? `Dang chuyen den ${selectedPaymentMethod === 'MOMO' ? 'MoMo' : 'VNPay'}...`
                  : paymentStatus?.status === 'COMPLETED'
                    ? 'Da thanh toan'
                    : 'Thanh toan'}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentPage;
