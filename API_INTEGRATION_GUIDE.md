# Admin Event API Integration Guide

## ✅ Completed Integration

### 1. **Backend API Endpoints** (Working)

- **GET** `/api/admin/events` - List all events with filters
- **GET** `/api/admin/events/{id}` - Get event detail
- **POST** `/api/admin/events/{id}/approve` - Approve event (DRAFT → PUBLISHER)
- **POST** `/api/admin/events/{id}/reject` - Reject event (DRAFT → CANCELLED)
- **POST** `/api/admin/events/{id}/lock` - Lock event (any → CANCELLED)
- **GET** `/api/admin/events/search` - Search events

### 2. **Frontend API Service** (Updated)

File: `src/services/eventService.js`

Added API functions:

```javascript
// Get all admin events with optional filters
getAllAdminEvents(status, search);

// Get single event detail
getAdminEventDetail(eventId);

// Approve event
approveEvent(eventId);

// Reject event
rejectEvent(eventId, reason);

// Lock event
lockEvent(eventId, reason);

// Search events
searchAdminEvents(query, status);
```

### 3. **Admin Event Detail Page** (Updated)

File: `src/pages/AdminEventDetail.jsx`

**Changes:**

- ✅ Load event data from API using `getAdminEventDetail()`
- ✅ Call `approveEvent()` when approve button clicked
- ✅ Call `rejectEvent()` with reason modal when reject button clicked
- ✅ Call `lockEvent()` for admin lock operation
- ✅ Display loading state while fetching
- ✅ Show error handling if event not found
- ✅ Map API response data to component display format

### 4. **Admin Dashboard** (Updated)

File: `src/pages/AdminDashboard.jsx`

**Changes:**

- ✅ Load events from `getAllAdminEvents()` on component mount
- ✅ Display draft event count dynamically
- ✅ Show events in upcoming section from real API data

---

## 🚀 How to Test

### Option 1: Postman (Already Tested)

```
1. GET http://localhost:8082/api/admin/events
2. GET http://localhost:8082/api/admin/events?status=DRAFT
3. GET http://localhost:8082/api/admin/events/31
4. POST http://localhost:8082/api/admin/events/31/approve
5. POST http://localhost:8082/api/admin/events/32/reject (with reason)
6. GET http://localhost:8082/api/admin/events/search?query=concert
```

### Option 2: Frontend UI

```
1. Go to `/admin/events` or `/admin` in your app
2. Click on any event to view detail
3. Click "Duyệt sự kiện" (Approve) button → event status changes to PUBLISHER
4. Click "Từ chối" (Reject) → modal appears → enter reason → confirm
5. Events list auto-refreshes without page reload
```

---

## 📋 API Response Format

### Approve/Reject/Lock Response

```json
{
  "success": true,
  "message": "Event approved successfully",
  "data": {
    "id": 31,
    "title": "Concert 2024 - The Grand Stage",
    "status": "PUBLISHER",
    "category": "Category #1",
    "createdAt": "10/04/2026",
    ...
  },
  "errorCode": null
}
```

---

## ⚙️ Configuration

**API Base URL:** `http://localhost:8082/api/admin`

To change, edit in `src/services/eventService.js`:

```javascript
const API_BASE_URL = "http://localhost:8082/api/admin";
```

---

## 🔄 Data Flow

1. **Frontend Request** → AdminEventDetail component calls `getAdminEventDetail(31)`
2. **HTTP Call** → fetch to `http://localhost:8082/api/admin/events/31`
3. **Backend Process** → Spring Boot retrieves event from database
4. **Response** → Returns JSON with event data
5. **Frontend Update** → Component state updates, UI re-renders

---

## ✨ Features Implemented

- [x] Load events from MySQL via Spring Boot API
- [x] Display event list with filters (status, search)
- [x] Show event detail page
- [x] Approve event (state transition)
- [x] Reject event with reason modal
- [x] Lock event (admin operation)
- [x] Search events by keyword
- [x] Responsive error handling
- [x] Loading indicators
- [x] Real-time UI updates

---

## 🐛 Troubleshooting

### API Returns 404

- Check if MySQL container is running: `docker ps`
- Check event ID exists: `GET /api/admin/events`

### CORS Errors

- Add to Spring Boot `application.properties` if needed:

```properties
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allow-credentials=true
```

### Event Data Not Showing

- Check browser console (F12) for errors
- Verify API response in Network tab
- Check event ID in URL matches database

---

## 📝 Next Steps

1. **Connect More Admin Pages:**
   - `/admin/orders` - Link to order management API
   - `/admin/users` - Link to user management API
   - `/admin/analytics` - Link to statistics API

2. **Add More Features:**
   - Bulk approve/reject events
   - Rent event soft delete
   - Event status history/timeline
   - Export events to CSV

3. **Improvements:**
   - Add pagination to event list
   - Add date range filters
   - Add permission levels (admin types)
   - Add audit logging for actions

---

**Last Updated:** April 10, 2026
**Status:** ✅ Integration Complete & Tested
