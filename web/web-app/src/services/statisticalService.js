import { get } from './apiClient';

/**
 * Service for fetching administrative statistics.
 * Routes through the Gateway to the statistical-service.
 */
export const getRevenueStats = async (startDate, endDate) => {
  try {
    const response = await get('/statistics/revenue', {
      start: startDate, end: endDate 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    throw error;
  }
};

export const getTopCustomers = async () => {
  try {
    const response = await get('/statistics/top-customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching top customers:', error);
    throw error;
  }
};

export const getEventStats = async (eventId, startDate, endDate) => {
  try {
    const response = await get(`/statistics/events/${eventId}`, {
      start: startDate, end: endDate 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for event ${eventId}:`, error);
    throw error;
  }
};
