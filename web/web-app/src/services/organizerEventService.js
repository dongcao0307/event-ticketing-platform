// src/services/organizerEventService.js
// Đã chuyển đổi sang dùng apiClient tập trung để tự động xử lý JWT Token & Auto-Refresh

import { get, post, put, del } from './apiClient';
import { authService } from './authService';

// Hàm lấy User ID của Organizer từ in-memory authService
const getOrganizerId = () => {
    const user = authService.getCurrentUser();
    return user?.userId || '1'; 
};

// Cấu hình các header đặc thù bắt buộc theo Business Logic của Backend ngoài Bearer Token
const getCustomHeaders = () => {
    return {
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
            // Dùng hàm post tập trung từ apiClient, truyền custom headers vào options
            return await post('/organizer/events/full', fullEventData, {
                headers: getCustomHeaders()
            });
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
            return await post('/organizer/events', eventData, {
                headers: getCustomHeaders()
            });
        } catch (error) {
            console.error('Lỗi khi tạo sự kiện:', error);
            throw error;
        }
    },

    // 2. Cập nhật sự kiện (PUT /organizer/events/{eventId})
    updateEvent: async (eventId, eventData) => {
        try {
            return await put(`/organizer/events/${eventId}`, eventData, {
                headers: getCustomHeaders()
            });
        } catch (error) {
            console.error(`Lỗi khi cập nhật sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 3. Tìm kiếm / Xem danh sách sự kiện của mình (GET /organizer/events)
    getMyEvents: async (keyword = '') => {
        try {
            // Hàm get từ apiClient tự động xử lý chuyển đổi params thành query string
            return await get('/organizer/events', keyword ? { keyword } : undefined, {
                headers: getCustomHeaders()
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sự kiện:', error);
            return []; // Trả về mảng rỗng để không lỗi UI
        }
    },

    // 4. Tạo suất diễn cho sự kiện (POST /organizer/events/{eventId}/performances)
    createPerformance: async (eventId, performanceData) => {
        try {
            return await post(`/organizer/events/${eventId}/performances`, performanceData, {
                headers: getCustomHeaders()
            });
        } catch (error) {
            console.error(`Lỗi khi tạo suất diễn cho sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 5. Xem chi tiết 1 sự kiện (GET /organizer/events/{eventId})
    getEventById: async (eventId) => {
        try {
            return await get(`/organizer/events/${eventId}`, undefined, { 
                headers: getCustomHeaders() 
            });
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 6. Xóa sự kiện (DELETE /organizer/events/{eventId})
    deleteEvent: async (eventId) => {
        try {
            // Cần gọi thông qua hàm request() tổng vì del() mặc định không nhận tham số options cấu hình header
            return await del(`/organizer/events/${eventId}`, { 
                headers: getCustomHeaders() 
            });
        } catch (error) {
            console.error(`Lỗi khi xóa sự kiện ${eventId}:`, error);
            throw error;
        }
    },

    // 7. Lấy danh sách suất diễn của 1 sự kiện (GET /organizer/events/{eventId}/performances)
    getPerformancesByEventId: async (eventId) => {
        try {
            return await get(`/organizer/events/${eventId}/performances`, undefined, { 
                headers: getCustomHeaders() 
            });
        } catch (error) {
            console.error(`Lỗi khi lấy danh sách suất diễn của sự kiện ${eventId}:`, error);
            return []; // Trả về mảng rỗng để giao diện không bị sập
        }
    }
};