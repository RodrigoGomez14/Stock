import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Register image cache service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-cache.js').then(
      (reg) => console.log('Cache SW registered:', reg.scope),
      (err) => console.log('Cache SW registration failed:', err)
    )
  })
}
