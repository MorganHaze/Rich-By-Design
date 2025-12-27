import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Safety Shim: Prevent "process is not defined" error if Vite's define hasn't kicked in yet
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

// Global error listener to display fatal crashes on screen
window.addEventListener('error', (event) => {
  console.error("Fatal initialization error:", event.error);
  const root = document.getElementById('root');
  if (root && (root.innerHTML === '' || root.innerHTML.includes('ESTABLISHING'))) {
    root.style.color = 'white';
    root.style.padding = '40px';
    root.style.fontFamily = 'monospace';
    root.style.background = '#0b1d2e';
    root.innerHTML = `
      <div style="background: #742a2a; border-radius: 12px; padding: 24px; border: 1px solid #fc8181; max-width: 600px; margin: 0 auto;">
        <h2 style="margin-top:0; color: #fff;">Runtime Error</h2>
        <p style="color: #feb2b2;">${event.message}</p>
        <p style="font-size: 11px; opacity: 0.6; color: #fff;">Location: ${event.filename}:${event.lineno}</p>
        <button onclick="window.location.reload()" style="margin-top: 15px; padding: 8px 16px; background: #fff; color: #742a2a; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Reload Application</button>
      </div>
    `;
  }
});

const container = document.getElementById('root');

if (container) {
  console.log("Initializing Rich By Design HQ...");
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
      <App />
    </React.StrictMode>
  );
}
