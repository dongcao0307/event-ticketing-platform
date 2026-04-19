import axios from 'axios';

const VNPAY_BASE_URL = 'http://localhost:8085/api/payment/vnpay';
const MOMO_BASE_URL = 'http://localhost:8085/api/payment/momo';

const toStableMockLong = (rawId, prefix) => {
  const safeId = String(rawId ?? '').trim();
  const digits = safeId.replace(/\D/g, '');

  if (digits) {
    const parsed = Number.parseInt(digits, 10);
    if (Number.isFinite(parsed)) {
      return prefix + parsed;
    }
  }

  let hash = 0;
  for (let i = 0; i < safeId.length; i += 1) {
    hash = (hash * 31 + safeId.charCodeAt(i)) % 1_000_000_000;
  }
  return prefix + hash;
};

export const mapEventIdToLong = (eventId) => toStableMockLong(eventId, 3_000_000_000);
export const mapEventPerformanceIdToLong = (performanceId) => toStableMockLong(performanceId, 4_000_000_000);

const unwrapApiResponseBody = (response) => response?.data?.body;

export const buildVnPayCheckoutPayload = ({
  order,
  event,
  showtime,
  returnUrl,
  clientIp = '127.0.0.1',
  paymentMethodId = 'VNPAY_SANDBOX',
}) => {
  const amount = Number(order?.totalAmount ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Tong tien thanh toan khong hop le de tao giao dich VNPay.');
  }

  const orderId = Number(order?.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    throw new Error('Khong tim thay order.id hop le.');
  }

  return {
    orderId,
    eventId: mapEventIdToLong(event?.id ?? orderId),
    eventPerformanceId: mapEventPerformanceIdToLong(showtime?.id ?? 'default'),
    amount,
    paymentMethodId,
    returnUrl,
    clientIp,
  };
};

export const buildMomoCheckoutPayload = ({
  order,
  event,
  showtime,
  returnUrl,
  clientIp = '127.0.0.1',
  paymentMethodId = 'MOMO_SANDBOX',
}) => {
  const amount = Number(order?.totalAmount ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Tong tien thanh toan khong hop le de tao giao dich MoMo.');
  }

  const orderId = Number(order?.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    throw new Error('Khong tim thay order.id hop le.');
  }

  return {
    orderId,
    eventId: mapEventIdToLong(event?.id ?? orderId),
    eventPerformanceId: mapEventPerformanceIdToLong(showtime?.id ?? 'default'),
    amount,
    paymentMethodId,
    orderInfo: `Thanh toan don hang #${orderId}`,
    returnUrl,
    clientIp,
  };
};

export const serviceCreateVnPayCheckout = async (payload) => {
  const response = await axios.post(`${VNPAY_BASE_URL}/checkout`, payload);
  return unwrapApiResponseBody(response);
};

export const serviceGetVnPayPaymentStatus = async (paymentId) => {
  const response = await axios.get(`${VNPAY_BASE_URL}/${paymentId}/status`);
  return unwrapApiResponseBody(response);
};

export const serviceCreateMomoCheckout = async (payload) => {
  const response = await axios.post(`${MOMO_BASE_URL}/checkout`, payload);
  return unwrapApiResponseBody(response);
};

export const serviceGetMomoPaymentStatus = async (paymentId) => {
  const response = await axios.get(`${MOMO_BASE_URL}/${paymentId}/status`);
  return unwrapApiResponseBody(response);
};
