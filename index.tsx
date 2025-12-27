import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Error listener to catch and display issues if the render fails
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.style.color = 'white';
    root.style.padding = '20px';
    root.style.fontFamily = 'monospace';
    root.innerHTML = `
      <div style="background: #742a2a; border-radius: 8px; padding: 20px; border: 1px solid #fc8181;">
        <h2 style="margin-top:0">Initialization Error</h2>
        <p>${event.message}</p>
        <p style="font-size: 12px; opacity: 0.7;">${event.filename}:${event.lineno}</p>
      </div>
    `;
  }
});

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
