import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// 앱(WebView)에서 열리면 ?app=1 이 붙는다
try {
  const params = new URLSearchParams(window.location.search);
  if (params.get("app") === "1") {
    document.documentElement.classList.add("handy-app");
  }
} catch {}
