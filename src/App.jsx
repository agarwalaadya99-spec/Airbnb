import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PropertyReviews from './pages/PropertyReviews';
import BookingVerification from './pages/BookingVerification';
import BookingConfirmation from './pages/BookingConfirmation';
import HostSafetySettings from './pages/HostSafetySettings';
import LandingPage from './pages/LandingPage';
import HostDashboard from './pages/HostDashboard';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-inter text-[#222222] antialiased">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<Home />} />
            <Route path="/property/:id" element={<PropertyReviews />} />
            <Route path="/booking-verification/:id" element={<BookingVerification />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/host/property/:id" element={<PropertyReviews />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/host-safety" element={<HostSafetySettings />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
