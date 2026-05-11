import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FinancialGoalsModal from './FinancialGoalsModal';
import ScheduledTransactionsModal from './ScheduledTransactionsModal';
import { useAuth } from '../context/AuthContext';
import { assetApi, goalApi, userApi, marketApi } from '../services/api';

const COLORS = ['#00d2ff', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6'];

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const [scheduledModalType, setScheduledModalType] = useState<'debt' | 'receivable' | null>(null);
  
  const [assets, setAssets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any>({});

  const [refreshKey, setRefreshKey] = useState(0);

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'var(--accent-green)';
    if (percent >= 40) return 'var(--accent-blue)';
    return '#ef4444';
  };

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [assetData, goalData, profileData, priceData] = await Promise.all([
          assetApi.getAssets(userId).catch(err => { console.error("Assets load failed:", err); return []; }),
          goalApi.getGoals(userId).catch(err => { console.error("Goals load failed:", err); return []; }),
          userApi.getMe(userId).catch(err => { console.error("Profile load failed:", err); return null; }),
          marketApi.getPrices().catch(err => { console.error("Market prices load failed:", err); return {}; })
        ]);
        setAssets(assetData);
        setGoals(goalData);
        setUserData(profileData);
        setMarketPrices(priceData);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [userId, refreshKey]);

  // Varlıkları grafiğe uygun formata dönüştür
  const portfolioData = assets.reduce((acc: any[], asset) => {
    const existing = acc.find(item => item.name === asset.type);
    const value = (Number(asset.quantity) || 0) * (Number(asset.currentPrice || asset.averageBuyPrice) || 0);
    
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ 
        name: asset.type, 
        value: value,
        color: COLORS[acc.length % COLORS.length]
      });
    }
    return acc;
  }, []);

  const totalNetWorth = portfolioData.reduce((sum, item) => sum + item.value, 0);

  const handleModalClose = () => {
    setIsGoalsModalOpen(false);
    setScheduledModalType(null);
    setRefreshKey(prev => prev + 1); // Verileri yenile
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempIncome, setTempIncome] = useState('');
  const [tempExpense, setTempExpense] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await userApi.updateMe(Number(userId), {
        monthlyIncome: Number(tempIncome),
        monthlyExpense: Number(tempExpense)
      });
      setIsProfileModalOpen(false);
      setRefreshKey(prev => prev + 1);
      alert("Profil başarıyla güncellendi!");
    } catch (err) {
      alert("Profil güncellenemedi.");
    }
  };

  return (
    <div className="dashboard-grid">
      
      {/* Date & Time Header */}
      <div className="col-span-12" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }} className="heading-gradient">Hoş Geldin, {userData?.username || 'Kullanıcı'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{formatDate(currentTime)}</p>
            <button 
              onClick={() => {
                setTempIncome(userData?.monthlyIncome?.toString() || '');
                setTempExpense(userData?.monthlyExpense?.toString() || '');
                setIsProfileModalOpen(true);
              }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              ⚙️ Profili Düzenle
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>{formatTime(currentTime)}</div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Profil Ayarları</h3>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Sabit Aylık Gelir (₺)</label>
                <input type="number" value={tempIncome} onChange={e => setTempIncome(e.target.value)} placeholder="Örn: 45000" required />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Tahmini Aylık Gider (₺)</label>
                <input type="number" value={tempExpense} onChange={e => setTempExpense(e.target.value)} placeholder="Örn: 25000" required />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>Vazgeç</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: 700 }}>Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Stats Section - Enhanced */}
      <div className="col-span-12">
        <div className="dashboard-grid" style={{ gap: '16px', marginBottom: '8px' }}>
          <div className="col-span-4 glass-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderLeft: '3px solid #3b82f6' }}>
            <div className="card-header">
              <span className="card-title" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📊 Toplam Net Varlık</span>
            </div>
            <div className="stat-value heading-gradient sensitive-data" style={{ fontSize: '28px', marginTop: '8px' }}>
              ₺{Number(totalNetWorth || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="stat-label text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>Tüm hesaplar & yatırımlar</div>
          </div>
          
          <div className="col-span-4 glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)', borderLeft: '3px solid var(--accent-green)' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>💰 Aylık Gelir</span>
              <button 
                onClick={() => setScheduledModalType('receivable')}
                style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-green)', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}
              >+</button>
            </div>
            <div className="stat-value sensitive-data" style={{ color: 'var(--accent-green)', fontSize: '26px', marginTop: '8px' }}>₺{Number(userData?.monthlyIncome || 0).toLocaleString()}</div>
            <div className="stat-label text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>Sabit Aylık Gelir</div>
          </div>

          <div className="col-span-4 glass-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)', borderLeft: '3px solid #ef4444' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>💸 Aylık Gider</span>
              <button 
                onClick={() => setScheduledModalType('debt')}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}
              >+</button>
            </div>
            <div className="stat-value sensitive-data" style={{ fontSize: '26px', marginTop: '8px', color: '#ef4444' }}>₺{Number(userData?.monthlyExpense || 0).toLocaleString()}</div>
            <div className="stat-label text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>Tahmini Aylık Giderler</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="col-span-12" style={{ marginBottom: '8px' }}>
        <div className="dashboard-grid" style={{ gap: '12px' }}>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'transactions' }))}
            className="col-span-6" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '16px',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
          >
            <span>💸</span> Yeni İşlem Ekle
          </button>
          <button 
            onClick={() => setIsGoalsModalOpen(true)}
            className="col-span-6"
            style={{ 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '16px',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)'}
          >
            <span>🎯</span> Yeni Hedef Oluştur
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-7 glass-card" style={{ minHeight: '400px' }}>
        <div className="card-header">
          <span className="card-title">Portföy Dağılımı & Analiz</span>
        </div>
        <div style={{ height: '340px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {portfolioData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₺${value.toLocaleString()}`}
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
              <p className="text-muted">Henüz varlık verisi yok. Portföyünü oluşturmaya başla!</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="col-span-5 glass-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-title">Finansal Hedefler</span>
          <button 
            onClick={() => setIsGoalsModalOpen(true)}
            style={{
              background: 'transparent',
              border: '1px solid var(--accent-blue)',
              color: 'var(--accent-blue)',
              padding: '4px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Tümünü Gör
          </button>
        </div>
        {/* Dinamik Hedef Listesi */}
        {goals.length > 0 ? goals.slice(0, 3).map((goal, idx) => {
          const progress = Math.round(((goal.currentAmount || 0) / (goal.currentTargetPrice || goal.targetAmount || 1)) * 100);
          return (
            <div key={idx} style={{ marginBottom: '20px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{goal.name}</span>
                <span style={{ color: getProgressColor(progress), fontWeight: 'bold', fontSize: '14px' }}>%{progress}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, progress)}%`, 
                  height: '100%', 
                  background: getProgressColor(progress)
                }}></div>
              </div>
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
            <p className="text-muted">Henüz hedef belirlemedin.</p>
          </div>
        )}

        {/* Acil Durum Fonu Mini Widget - REMOVED */}

        {/* Canlı Piyasa İzleme (Vision Item #2) */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              Canlı Piyasa İzleme
            </span>
            <span style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 800 }}>LIVE</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { symbol: 'XAU', label: 'Altın (Gram)', price: marketPrices.XAU, icon: '🟡' },
              { symbol: 'BTC', label: 'Bitcoin', price: marketPrices.BTC, icon: '🟠' },
              { symbol: 'AAPL', label: 'Apple Inc.', price: marketPrices.AAPL, icon: '🍎' }
            ].map(m => (
              <div key={m.symbol} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{m.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{m.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{m.symbol}/TRY</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>₺{m.price ? m.price.toLocaleString() : '---'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--accent-green)' }}>+0.45% ▲</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <FinancialGoalsModal isOpen={isGoalsModalOpen} onClose={handleModalClose} />
      <ScheduledTransactionsModal
        isOpen={scheduledModalType !== null}
        onClose={handleModalClose}
        type={scheduledModalType}
      />
    </div>
  );
};

export default Dashboard;
