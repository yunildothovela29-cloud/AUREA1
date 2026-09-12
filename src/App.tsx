/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { BuyPage } from './pages/BuyPage';
import { RentPage } from './pages/RentPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ScheduleVisitPage } from './pages/ScheduleVisitPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { AdminPage } from './pages/AdminPage';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#261B14]">
        <ScrollToTop />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#261B14]">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<BuyPage />} />
          <Route path="/arrendar" element={<RentPage />} />
          <Route path="/imovel/:id" element={<PropertyDetailPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contactos" element={<ContactPage />} />
          <Route path="/agendar" element={<ScheduleVisitPage />} />
          <Route path="/confirmacao" element={<ConfirmationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}


