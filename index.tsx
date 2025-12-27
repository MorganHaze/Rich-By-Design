import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

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
    console.log("Rich By Design HQ: System Online.");
  } catch (error) {
    console.error("Critical Failure: Application failed to mount.", error);
    container.innerHTML = `
      <div style="color: #fbbf24; padding: 40px; font-family: serif; text-align: center; background: #102a43; height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h2 style="font-size: 2rem; margin-bottom: 10px;">SYSTEM OFFLINE</h2>
        <p style="color: white; opacity: 0.8; max-width: 400px; margin: 0 auto;">The wealth dashboard could not be initialized. Please check your network connection or deployment status.</p>
        <button onclick="window.location.reload()" style="margin-top: 30px; background: #fbbf24; color: #102a43; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em;">Retry Connection</button>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
