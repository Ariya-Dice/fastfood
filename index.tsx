
// شروع اپلیکیشن React (نقطه ورودی)
// - نصب ریشه اصلی بر روی المنت id='root'
// - مدیریت بارگذاری App
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// جستجوی المان ریشه جهت رندر کردن کامپوننت‌ها
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
