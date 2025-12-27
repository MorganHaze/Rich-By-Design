import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Safety Shim: Immediate environment check to prevent "process is not defined" errors
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const initializeApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Rich By Design HQ Loaded Successfully.");
  } catch (error) {
    console.error("Initialization failed:", error);
    container.innerHTML = `
      <div style="color: white; padding: 40px; font-family: sans-serif; text-align: center;">
        <h2 style="color: #fbbf24;">System Offline</h2>
        <p>There was an error launching the dashboard. Please check the console for details.</p>
        <button onclick="window.location.reload()" style="background: #fbbf24; color: #102a43; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer;">Retry Connection</button>
      </div>
    `;
  }
};

// Global error handler for unhandled promises or script failures
window.addEventListener('error', (e) => {
  console.error("Caught global error:", e.message);
});

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
