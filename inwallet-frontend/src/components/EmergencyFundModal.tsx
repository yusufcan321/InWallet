import React from 'react';

interface EmergencyFundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const monthlyExpense = 18200;
const currentFund = 21840; // 1.2 months
const monthsCovered = +(currentFund / monthlyExpense).toFixed(1);
const targetMonths = 6;
const targetAmount = monthlyExpense * targetMonths;
const percent = Math.min(100, Math.round((currentFund / targetAmount) * 100));
const remaining = targetAmount - currentFund;

const getStatusColor = () => {
  if (monthsCovered < 1) return '#ef4444';
  if (monthsCovered < 3) return '#f59e0b';
  if (monthsCovered < 6) return '#60a5fa';
  return '#10b981';
};

const statusColor = getStatusColor();

const milestones = [
  { months: 1, label: '1 Aylık', amount: monthlyExpense * 1 },
  { months: 3, label: '3 Aylık', amount: monthlyExpense * 3 },
  { months: 6, label: '6 Aylık', amount: monthlyExpense * 6 },
];

const EmergencyFundModal: React.FC<EmergencyFundModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={onClose}
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div
        className="modal-content animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          width: '95%',
          padding: 0,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Gradient Header */}
        <div style={{
          background: `linear-gradient(135deg, #1c1917 0%, #292524 60%, #1c1917 100%)`,
          borderBottom: `3px solid ${statusColor}`,
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: `${statusColor}08` }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: `${statusColor}20`, border: `1px solid ${statusColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fff' }}>Acil Durum Fonu</h2>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>
                  {monthsCovered < 3
                    ? '⚠️ Dikkat: Risk altındasın!'
                    : monthsCovered < 6
                    ? '📈 İyi gidiyorsun, devam et!'
                    : '🎉 Tebrikler! Güvende hissedebilirsin.'}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: '18px', cursor: 'pointer',
              width: '36px', height: '36px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '40px', fontWeight: 900, color: statusColor, letterSpacing: '-2px', lineHeight: 1 }}>
                {monthsCovered}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Aylık gider güvende</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '32px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>₺{currentFund.toLocaleString()}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Mevcut fon</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '32px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>₺{targetAmount.toLocaleString()}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>6 Aylık hedef</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 32px' }}>
          {/* Progress */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>İlerleme</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: statusColor }}>%{percent}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'var(--bg-secondary)', borderRadius: '5px', overflow: 'visible', position: 'relative' }}>
              <div style={{
                width: `${percent}%`, height: '100%',
                background: `linear-gradient(90deg, ${statusColor}aa, ${statusColor})`,
                borderRadius: '5px',
                boxShadow: `0 0 12px ${statusColor}60`,
              }} />
              {/* Milestones */}
              {milestones.map(ms => {
                const pct = (ms.months / targetMonths) * 100;
                const reached = currentFund >= ms.amount;
                return (
                  <div key={ms.months} style={{
                    position: 'absolute', left: `${pct}%`, top: '-18px',
                    transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <div style={{
                      fontSize: '9px', fontWeight: 700, whiteSpace: 'nowrap',
                      color: reached ? statusColor : 'var(--text-secondary)',
                      marginBottom: '2px',
                    }}>{ms.label}</div>
                    <div style={{
                      width: '2px', height: '16px',
                      background: reached ? statusColor : 'var(--border-color)',
                      marginTop: '2px',
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Hedefe ulaşmak için <strong style={{ color: 'var(--text-primary)' }}>₺{remaining.toLocaleString()}</strong> daha biriktirmen gerekiyor.
            </div>
          </div>

          {/* Why it matters */}
          <div style={{
            padding: '16px 20px',
            background: `${statusColor}08`,
            border: `1px solid ${statusColor}20`,
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Neden bu kadar önemli?</strong>
            Acil durum fonu olmadan iş kaybı, sağlık krizi veya beklenmedik bir gider durumunda
            <strong style={{ color: '#ef4444' }}> yatırımlarını düşük fiyata satmak zorunda kalabilirsin.</strong> Bu fonun varlığı, portföyünü dokunulmaz tutmanı sağlar.
          </div>

          {/* Action plan */}
          <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>📋 Hızlı Büyütme Planı</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Aylık 5.000₺ ayırırsan', months: Math.ceil(remaining / 5000), color: '#60a5fa' },
              { label: 'Aylık 10.000₺ ayırırsan', months: Math.ceil(remaining / 10000), color: '#10b981' },
              { label: 'Freelance gelirinle (15.000₺)', months: Math.ceil(remaining / 15000), color: '#a78bfa' },
            ].map((plan, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{plan.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: plan.color }}>
                  {plan.months} ayda tamamlanır
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px',
              background: `linear-gradient(135deg, ${statusColor}cc, ${statusColor})`,
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, marginTop: '24px',
              cursor: 'pointer',
              boxShadow: `0 6px 20px ${statusColor}40`,
            }}
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyFundModal;
