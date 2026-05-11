import React from 'react';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (viewId: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: '🏠', label: 'Ana Sayfa', desc: 'Genel özet panosu', color: 'rgba(59, 130, 246, 0.2)', iconColor: '#3b82f6' },
  { id: 'portfolio', icon: '💼', label: 'Portföyüm', desc: 'Varlıklarınızı inceleyin', color: 'rgba(139, 92, 246, 0.2)', iconColor: '#8b5cf6' },
  { id: 'budget', icon: '📊', label: 'Bütçe Analizi', desc: 'Gelir/Gider dengesi', color: 'rgba(16, 185, 129, 0.2)', iconColor: '#10b981' },
  { id: 'dca', icon: '📈', label: 'DCA Planlayıcı', desc: 'Düzenli yatırım planı', color: 'rgba(99, 102, 241, 0.2)', iconColor: '#6366f1' },
  { id: 'transactions', icon: '🔁', label: 'İşlem Geçmişi', desc: 'Gelir ve gider akışı', badge: 3, color: 'rgba(16, 185, 129, 0.2)', iconColor: '#10b981' },
  { id: 'goals', icon: '🎯', label: 'Hedeflerim', desc: 'Hayallerinizi planlayın', color: 'rgba(245, 158, 11, 0.2)', iconColor: '#f59e0b' },
  { id: 'favorites', icon: '⭐', label: 'Favoriler', desc: 'Sık kullanılan işlemler', color: 'rgba(250, 204, 21, 0.2)', iconColor: '#facc15' },
  { id: 'settings', icon: '⚙️', label: 'Ayarlar', desc: 'Uygulama tercihleri', badge: '!', color: 'rgba(236, 72, 153, 0.2)', iconColor: '#ec4899' },
];

const financialQuotes = [
  { text: "Kural 1: Asla para kaybetme. Kural 2: Birinci kuralı asla unutma.", author: "Warren Buffett" },
  { text: "Fiyat, ödediğinizdir. Değer ise elde ettiğinizdir.", author: "Warren Buffett" },
  { text: "Borsa, sabırsızlardan sabırlılara para aktarma aracıdır.", author: "Warren Buffett" },
  { text: "En iyi yatırım, kendine yaptığın yatırımdır.", author: "Benjamin Franklin" },
  { text: "Zenginler zamanı, fakirler parayı satın alır.", author: "Robert Kiyosaki" },
  { text: "Fırsatlar her gün gelir, önemli olan onları görebilmektir.", author: "Peter Lynch" },
  { text: "Parayı kontrol etmeyi öğrenemezsen, para seni kontrol eder.", author: "Dave Ramsey" },
  { text: "Risk, ne yaptığını bilmemekten gelir.", author: "Warren Buffett" },
  { text: "Bugün bir ağacın gölgesinde oturabilmenizin sebebi, birinin yıllar önce o ağacı dikmiş olmasıdır.", author: "Warren Buffett" },
  { text: "İyi bir yatırım portföyü, bir sabun kalıbı gibidir; ne kadar çok dokunursan o kadar küçülür.", author: "Eugene Fama" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate }) => {
  const { username, userId } = useAuth();
  
  const handleNavigation = (id: string) => {
    onNavigate(id);
    onClose();
  };

  // Get daily quote based on the day of the year
  const getDailyQuote = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return financialQuotes[dayOfYear % financialQuotes.length];
  };

  const dailyQuote = getDailyQuote();

  const [theme, setTheme] = React.useState(localStorage.getItem('inwallet_theme') || 'dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('inwallet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer glass-card ${isOpen ? 'open' : ''}`}>
        
        {/* Brand Header with Logo */}
        <div className="sidebar-brand" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            InWallet
          </div>
          <button className="close-btn" onClick={onClose} style={{ fontSize: '28px' }}>×</button>
        </div>

        {/* User Profile Area (Dynamic) */}
        <div className="sidebar-profile">
          <div className="profile-avatar" style={{ background: 'var(--accent-blue)', color: 'white' }}>
            {(username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <div className="profile-name">{username || 'Misafir Kullanıcı'}</div>
            <div className="profile-email">ID: #{userId || '---'}</div>
          </div>
        </div>

        {/* Daily Motivation Quote */}
        <div className="sidebar-quote-card">
          <div className="quote-text">{dailyQuote.text}</div>
          <div className="quote-author">
            <span className="author-name">~ {dailyQuote.author}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MENÜ</div>
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.id)}
                >
                  <div className="nav-icon-wrapper" style={{ background: item.color, border: `1px solid ${item.iconColor}40` }}>
                    <span className="nav-icon">{item.icon}</span>
                  </div>
                  <div className="nav-text-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-desc">{item.desc}</span>
                  </div>
                  {item.badge && (
                    <span className={`nav-badge ${item.badge === '!' ? 'alert-badge' : 'count-badge'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions Footer */}
        <div className="sidebar-footer">
          <button 
            className="nav-item quick-add-btn" 
            onClick={() => handleNavigation('transactions')}
            style={{ width: '100%', marginBottom: '12px', background: 'var(--accent-blue)', color: 'white', borderRadius: '12px', border: 'none', padding: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            <span>➕</span> Hızlı İşlem Ekle
          </button>
          <div className="footer-actions">
            <button className="quick-action-btn" onClick={toggleTheme}>
              <span className="qa-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span>Tema</span>
            </button>
            <button className="quick-action-btn" onClick={() => alert('İletişim: destek@inwallet.app')}>
              <span className="qa-icon">❓</span>
              <span>Yardım</span>
            </button>
          </div>
          <button className="nav-item logout-btn" onClick={() => alert('Çıkış yapılıyor...')}>
            <div className="nav-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <span className="nav-icon">🚪</span>
            </div>
            <span className="nav-label" style={{ marginLeft: '12px' }}>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
