/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Clean Human Website Application - White, Beige & Brown */}
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#261B14]">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/comprar" element={<BuyPage />} />
            <Route path="/arrendar" element={<RentPage />} />
            <Route path="/imovel/:id" element={<PropertyDetailPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contactos" element={<ContactPage />} />
            <Route path="/agendar" element={<ScheduleVisitPage />} />
            <Route path="/confirmacao" element={<ConfirmationPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

