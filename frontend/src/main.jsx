import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import ListingsPage from './listings-page/ListingsPage';
import PropertyDetailPage from './property-detail-page/PropertyDetailPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)