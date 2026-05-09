import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AIChatWidget from './components/AIChatWidget';
import Sidebar from './components/Sidebar';

// Pages
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard />;
      case 'portfolio': return <Portfolio />;
      case 'transactions': return <Transactions />;
      case 'goals': return <Goals />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      
      <div className="app-container">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="menu-btn" 
              aria-label="Menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="10" width="32" height="18" rx="4" fill="url(#wallet_bg)" stroke="url(#wallet_border)" strokeWidth="1" style={{ filter: 'drop-shadow(0 6px 12px rgba(37, 99, 235, 0.4))' }}/>
                <path d="M2 14C12 18 24 18 34 14V24C34 26.209 32.209 28 30 28H6C3.791 28 2 26.209 2 24V14Z" fill="url(#wallet_front)"/>
                <path d="M2 14C12 18 24 18 34 14" stroke="url(#flap_edge)" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="13" y="16" width="10" height="8" rx="2" fill="#0F172A" stroke="rgba(255,255,255,0.2)" strokeWidth="1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}/>
                <path d="M14.5 18.5L16 21L18 18.5L20 21L21.5 18.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px #60A5FA)' }}/>
                <defs>
                  <linearGradient id="wallet_bg" x1="2" y1="10" x2="34" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1E3A8A"/>
                    <stop offset="1" stopColor="#1D4ED8"/>
                  </linearGradient>
                  <linearGradient id="wallet_front" x1="2" y1="14" x2="34" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#2563EB"/>
                  </linearGradient>
                  <linearGradient id="wallet_border" x1="2" y1="10" x2="34" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#93C5FD"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                  <linearGradient id="flap_edge" x1="2" y1="14" x2="34" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" stopOpacity="0.8"/>
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="app-logo heading-gradient">InWallet</div>
            </div>
          </div>
          <div className="user-profile">
            <div className="text-muted">Hoş Geldiniz, Sami</div>
            <div className="avatar">SE</div>
          </div>
        </header>
        
        <main>
          {renderView()}
        </main>

        <AIChatWidget />
      </div>
    </>
  );
}

export default App;
