import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import ListingsPage from './listings-page/ListingsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListingsPage />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)