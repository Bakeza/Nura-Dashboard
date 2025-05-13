
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add custom pixel art styles
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  .pixel-font {
    font-family: 'VT323', monospace;
    letter-spacing: 1px;
  }

  .pixel-border {
    box-shadow: 
      0 4px 0 rgba(0, 0, 0, 0.2),
      inset -4px -4px 0 rgba(0, 0, 0, 0.2),
      inset 4px 4px 0 rgba(255, 255, 255, 0.1);
    image-rendering: pixelated;
  }

  .pixel-border-sm {
    box-shadow: 
      0 2px 0 rgba(0, 0, 0, 0.2),
      inset -2px -2px 0 rgba(0, 0, 0, 0.2),
      inset 2px 2px 0 rgba(255, 255, 255, 0.1);
    image-rendering: pixelated;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
