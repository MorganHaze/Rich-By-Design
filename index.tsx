import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Safety Shim: Prevent "process is not defined" errors in the browser
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render application:", error);
    container.innerHTML = `
      <div style="color: white; padding: 40px; font-family: sans-serif; text-align: center; background: #102a43; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h2 style="color: #fbbf24; font-size: 2rem; margin-bottom: 1rem;">System Launch Interrupted</h2>
        <p style="opacity: 0.8; margin-bottom: 2rem;">The financial dashboard encountered a technical barrier during initialization.</p>
        <button onclick="window.location.reload()" style="background: #fbbf24; color: #102a43; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em;">Re-establish Connection</button>
      </div>
    `;
  }
}
