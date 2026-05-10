import React, { useState } from 'react';

const allTransactions = [
  { id: 1, title: 'Kira Ödemesi', date: '01 Mayıs 2026', amount: '-₺12,000.00', type: 'expense', category: 'Konut' },
  { id: 2, title: 'Maaş Yatma', date: '01 Mayıs 2026', amount: '+₺45,000.00', type: 'income', category: 'Gelir' },
  { id: 3, title: 'Altın Alış (10gr)', date: '28 Nisan 2026', amount: '-₺24,500.00', type: 'investment', category: 'Yatırım' },
  { id: 4, title: 'Market Harcaması', date: '25 Nisan 2026', amount: '-₺1,250.00', type: 'expense', category: 'Gıda' },
  { id: 5, title: 'Hisse Senedi Satış', date: '20 Nisan 2026', amount: '+₺5,400.00', type: 'income', category: 'Yatırım Getirisi' },
  { id: 6, title: 'Netflix Abonelik', date: '18 Nisan 2026', amount: '-₺250.00', type: 'expense', category: 'Eğlence' }
];

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = allTransactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'income') return tx.type === 'income';
    if (filter === 'expense') return tx.type === 'expense' || tx.type === 'investment';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'income':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
          </svg>
        );
      case 'investment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
          </svg>
        );
    }
  };

  const getIconStyles = (type: string) => {
    if (type === 'income') return { bg: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--success)' };
    if (type === 'investment') return { bg: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' };
  };

  return (
    <div className="dashboard-grid">
      <div className="col-span-12 glass-card animate-slide-up">
        <div className="card-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span className="card-title" style={{ fontSize: '24px', margin: 0 }}>İşlem Geçmişi</span>
          
          {/* Enhanced Premium Filters */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? 'var(--accent-blue)' : 'transparent',
                color: filter === 'all' ? 'white' : 'var(--text-secondary)',
                border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease',
                boxShadow: filter === 'all' ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'
              }}
            >
              Tümü
            </button>
            <button 
              onClick={() => setFilter('income')}
              style={{
                background: filter === 'income' ? 'var(--success)' : 'transparent',
                color: filter === 'income' ? 'white' : 'var(--text-secondary)',
                border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease',
                boxShadow: filter === 'income' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              Gelirler
            </button>
            <button 
              onClick={() => setFilter('expense')}
              style={{
                background: filter === 'expense' ? 'var(--danger)' : 'transparent',
                color: filter === 'expense' ? 'white' : 'var(--text-secondary)',
                border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease',
                boxShadow: filter === 'expense' ? '0 2px 8px rgba(239, 68, 68, 0.4)' : 'none'
              }}
            >
              Giderler
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ margin: 0, fontSize: '16px' }}>Bu kategoride işlem bulunmuyor.</p>
            </div>
          ) : (
            filteredTransactions.map((tx, index) => {
              const iconStyles = getIconStyles(tx.type);
              return (
                <div 
                  key={tx.id} 
                  style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px 24px', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    animation: `slideUp 0.4s ease forwards`,
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: iconStyles.bg,
                      border: iconStyles.border,
                      color: iconStyles.color,
                      boxShadow: `0 4px 12px ${iconStyles.bg.replace('0.12', '0.2')}`
                    }}>
                      {getIcon(tx.type)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '17px', color: 'var(--text-primary)', fontWeight: 600 }}>{tx.title}</h4>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{tx.date}</span>
                        <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)' }}></span>
                        <span>{tx.category}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '700',
                    color: tx.amount.startsWith('+') ? 'var(--success)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    letterSpacing: '-0.5px'
                  }}>
                    {tx.amount}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
