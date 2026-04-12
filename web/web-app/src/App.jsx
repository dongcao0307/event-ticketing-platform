import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import OrganizerPage from './pages/OrganizerPage'
import MyEvents from './pages/organizer/MyEvents'
import EventPage from './pages/EventPage'

import AdminDashboard from './pages/AdminDashboard'
import EventDetailPage from './pages/EventPage'
import SearchPage from './pages/SearchPage'
import MyAccountPage from './pages/MyAccountPage'
import AccountSettings from './pages/account/AccountSettings'
import MyTickets from './pages/account/MyTickets'
import TicketDetailPage from './pages/TicketDetailPage'
// Import trang mới vừa tạo
import EventManagement from './pages/EventManagement'
import UserManagement from './pages/UserManagement'
import AdminEventDetail from './pages/AdminEventDetail'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminOrders from './pages/AdminOrders'
import AdminRoute from './components/AdminRoute'

import EventDetailPublicPage from './pages/EventDetailPublicPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import TicketSelectPage from './pages/TicketSelectPage'
import BookingInfoPage from './pages/BookingInfoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public event detail & booking flow */}
        <Route path="/event/:id" element={<EventDetailPublicPage />} />
        <Route path="/event/:id/seats" element={<SeatSelectionPage />} />
        <Route path="/event/:id/tickets" element={<TicketSelectPage />} />
        <Route path="/event/:id/booking" element={<BookingInfoPage />} />

        {/* Organizer */}
        <Route path="/organizer" element={<OrganizerPage />} />
        <Route path="/organizer/my-events" element={<MyEvents />} />
        <Route path="/organizer/event/:id" element={<EventPage />} />

        {/* User account */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/my-account" element={<MyAccountPage />}>
          <Route index element={<AccountSettings />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="tickets" element={<MyTickets />} />
        </Route>
        <Route path="/ticket/:id" element={<TicketDetailPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><EventManagement /></AdminRoute>} />
        <Route path="/admin/events/:id" element={<AdminRoute><AdminEventDetail /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
