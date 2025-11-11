import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWithAuth from './AppWithAuth';
import './index.css';   // ✅ import Tailwind CSS here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
);

