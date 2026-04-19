import axios from 'axios';

// Đổi port cho khớp với backend của bạn
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Hàm lấy User ID của Organizer. 
// Tạm thời mình để mặc định là '1' nếu chưa có login, bạn sửa lại key trong localStorage cho đúng dự án nhé.
const getOrganizerId = () => {
    return localStorage.getItem('userId') || '1'; 
};

// Cấu hình header bắt buộc theo Controller (@RequestHeader("X-User-Id"))
const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'X-User-Id': getOrganizerId()
    };
};

export const organizerEventService = {
    // ==========================================
    // API GOM CHUNG CHO 4 BƯỚC TẠO SỰ KIỆN (WIZARD FORM)
    // ==========================================

    // 0. Tạo toàn bộ sự kiện (Gom cả Bước 1, 2, 3, 4)
    createFullEvent: async (fullEventData) => {
        try {
            // Chú ý: Đường dẫn là /organizer/events/full
            const response = await axios.post(`${API_URL}/organizer/events/full`, fullEventData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo toàn bộ sự kiện:', error);
            throw error;
        }
    },

    // ==========================================
    // CÁC API ĐÃ CÓ TRONG CONTROLLER
    // ==========================================

    // 1. Tạo sự kiện (POST /organizer/events)
    createEvent: async (eventData) => {
        try {
            const response = await axios.post(`${API_URL}/organizer/events`, eventData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo sự kiện:', error);
            throw error;
        }
    },

    // 2. Cập nhật sự kiện (PUT /organizer/events/{eventId})
    updateEvent: async (eventId, eventData) => {
        try {
            const response = await axios.put(`${API_URL}/organizer/events/${eventId}`, eventData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 3. Tìm kiếm / Xem danh sách sự kiện của mình (GET /organizer/events)
    getMyEvents: async (keyword = '') => {
        try {
            const response = await axios.get(`${API_URL}/organizer/events`, {
                headers: getAuthHeaders(),
                params: keyword ? { keyword } : {}
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            return []; // Trả về mảng rỗng để không lỗi UI
        }
    },

    // 4. Tạo suất diễn cho sự kiện (POST /organizer/events/{eventId}/performances)
    createPerformance: async (eventId, performanceData) => {
        try {
            const response = await axios.post(`${API_URL}/organizer/events/${eventId}/performances`, performanceData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi tạo suất diễn cho sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 5. Xem chi tiết 1 sự kiện (GET /organizer/events/{eventId})
    getEventById: async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/organizer/events/${eventId}`, { 
                headers: getAuthHeaders() 
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 6. Xóa sự kiện (DELETE /organizer/events/{eventId})
    deleteEvent: async (eventId) => {
        try {
            const response = await axios.delete(`${API_URL}/organizer/events/${eventId}`, { 
                headers: getAuthHeaders() 
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 7. Lấy danh sách suất diễn của 1 sự kiện (GET /organizer/events/{eventId}/performances)
    getPerformancesByEventId: async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/organizer/events/${eventId}/performances`, { 
                headers: getAuthHeaders() 
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy danh sách suất diễn của sự kiện ${eventId}:`, error);
            return []; // Trả về mảng rỗng để giao diện (ví dụ: bảng danh sách) không bị sập
        }
    }
};