import React, { useState } from 'react';

const monthlyExpense = 18200;
const currentFund = 21840;
const targetMonths = 6;
const targetAmount = monthlyExpense * targetMonths;
const monthsCovered = +(currentFund / monthlyExpense).toFixed(1);
const percent = Math.min(100, Math.round((currentFund / targetAmount) * 100));
const remaining = targetAmount - currentFund;

const milestones = [
  { months: 1, label: '1 Ay', amount: monthlyExpense * 1 },
  { months: 3, label: '3 Ay', amount: monthlyExpense * 3 },
  { months: 6, label: '6 Ay', amount: monthlyExpense * 6 },
];

const plans = [
  { label: 'Aylık 5.000₺ ek tasarruf', extra: 5000, color: '#60a5fa' },
  { label: 'Aylık 10.000₺ ek tasarruf', extra: 10000, color: '#10b981' },
  { label: 'Freelance gelirinden (15.000₺)', extra: 15000, color: '#a78bfa' },
];

const risks = [
  {
    icon: '💼',
    title: 'İş Kaybı',
    desc: 'Fonunuz 1.2 aylık giderinizi karşılıyor. İş kaybı durumunda sadece 36 gün hayatta kalabilirsiniz.',
    severity: 'high',
  },
  {
    icon: '🏥',
    title: 'Sağlık Acili',
    desc: 'Beklenmedik bir ameliyat veya tedavi masrafı portföyünüzü likide etmenizi gerektirebilir.',
    severity: 'high',
  },
  {
    icon: '🚗',
    title: 'Araç / Konut Arızası',
    desc: 'Büyük onarım masrafları acil fon olmadan kredi yüküne dönüşür.',
    severity: 'medium',
  },
];

const severityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const EmergencyFund: React.FC = () => {
  const [fundAmount, setFundAmount] = useState(currentFund);

  const dynamicMonths = +(fundAmount / monthlyExpense).toFixed(1);
  const dynamicPercent = Math.min(100, Math.round((fundAmount / targetAmount) * 100));
  const statusColor =
    dynamicMonths < 1 ? '#ef4444' :
    dynamicMonths < 3 ? '#f59e0b' :
    dynamicMonths < 6 ? '#60a5fa' : '#10b981';

  return (
    <div className="dashboard-grid">

      {/* Header Card */}
      <div className="col-span-12 glass-card animate-slide-up" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 60%, #1c1917 100%)',
          borderBottom: `3px solid ${statusColor}`,
          padding: '32px 36px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: `${statusColor}06` }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: `${statusColor}04` }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${statusColor}25`, border: `1px solid ${statusColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#fff' }}>Acil Durum Fonu</h2>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
                    {dynamicMonths < 3 ? '⚠️ Risk altındasın — harekete geç!' : dynamicMonths < 6 ? '📈 İyi gidiyorsun, devam et!' : '🎉 Tebrikler! Finansal güvencedesin.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '52px', fontWeight: 900, color: statusColor, letterSpacing: '-3px', lineHeight: 1 }}>{dynamicMonths}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Aylık gider karşılığı</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '40px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>₺{fundAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Mevcut fon</div>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '40px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>₺{targetAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>6 Aylık hedef</div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div style={{
              padding: '16px 24px',
              background: `${statusColor}18`,
              border: `1px solid ${statusColor}35`,
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: statusColor }}>%{dynamicPercent}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Tamamlandı</div>
            </div>
          </div>
        </div>

        {/* Progress Bar with Milestones */}
        <div style={{ padding: '28px 36px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', paddingTop: '28px' }}>
            {/* Milestone Labels */}
            {milestones.map(ms => {
              const pct = (ms.months / targetMonths) * 100;
              const reached = fundAmount >= ms.amount;
              return (
                <div key={ms.months} style={{ position: 'absolute', left: `${pct}%`, top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: reached ? statusColor : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{ms.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.7, whiteSpace: 'nowrap' }}>₺{(ms.amount / 1000).toFixed(0)}k</span>
                </div>
              );
            })}

            {/* Bar */}
            <div style={{ width: '100%', height: '14px', background: 'var(--bg-primary)', borderRadius: '7px', overflow: 'visible', position: 'relative' }}>
              <div style={{
                width: `${dynamicPercent}%`, height: '100%',
                background: `linear-gradient(90deg, ${statusColor}aa, ${statusColor})`,
                borderRadius: '7px',
                boxShadow: `0 0 16px ${statusColor}50`,
                transition: 'width 0.6s ease',
              }} />
              {milestones.map(ms => {
                const pct = (ms.months / targetMonths) * 100;
                const reached = fundAmount >= ms.amount;
                return (
                  <div key={ms.months} style={{
                    position: 'absolute', left: `${pct}%`, top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: reached ? statusColor : 'var(--bg-secondary)',
                    border: `2px solid ${reached ? statusColor : 'var(--border-color)'}`,
                    zIndex: 10,
                    boxShadow: reached ? `0 0 10px ${statusColor}80` : 'none',
                    transition: 'all 0.4s ease',
                  }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="col-span-5 glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
            </svg>
            Fon Simülatörü
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Kaydırıcıyla farklı senaryoları simüle et</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mevcut Fon Tutarı</label>
            <span style={{ fontSize: '16px', fontWeight: 800, color: statusColor }}>₺{fundAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={targetAmount}
            step={1000}
            value={fundAmount}
            onChange={e => setFundAmount(Number(e.target.value))}
            style={{ width: '100%', accentColor: statusColor }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            <span>₺0</span><span>₺{targetAmount.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Aylık Gider Karşılığı', value: `${dynamicMonths} Ay`, color: statusColor },
            { label: 'Hedefe Kalan', value: `₺${Math.max(0, targetAmount - fundAmount).toLocaleString()}`, color: 'var(--text-primary)' },
            { label: 'Tamamlama Oranı', value: `%${dynamicPercent}`, color: statusColor },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plans */}
      <div className="col-span-7 glass-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Hızlı Büyütme Planları
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Hedefe ulaşmak için farklı senaryolar</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {plans.map(plan => {
            const months = Math.ceil(Math.max(0, targetAmount - fundAmount) / plan.extra);
            return (
              <div key={plan.label} style={{
                padding: '18px 20px',
                background: `${plan.color}08`,
                border: `1px solid ${plan.color}25`,
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: plan.color, boxShadow: `0 0 8px ${plan.color}60` }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{plan.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: plan.color }}>
                    {months <= 0 ? '✅ Tamam!' : `${months} Ay`}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {months <= 0 ? 'Hedefe ulaşıldı' : 'hedefe ulaşırsın'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why It Matters */}
        <div style={{
          marginTop: '20px',
          padding: '18px 20px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '14px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: '28px', lineHeight: 1 }}>🛡️</div>
          <div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Neden kritik?</strong>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
              Acil durum fonu olmadan beklenmedik bir gelir kesilmesi veya büyük masraf,
              <strong style={{ color: '#ef4444' }}> yatırımlarını en kötü zamanda satmana</strong> yol açar.
              Bu "davranışsal finans tuzağı" en iyi portföyleri bile mahveder.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="col-span-12 glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Risk Senaryoları (Mevcut Fonla)
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {risks.map(risk => (
            <div key={risk.title} style={{
              padding: '20px',
              background: `${severityColors[risk.severity]}06`,
              border: `1px solid ${severityColors[risk.severity]}20`,
              borderTop: `4px solid ${severityColors[risk.severity]}`,
              borderRadius: '14px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{risk.icon}</div>
              <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>{risk.title}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>{risk.desc}</p>
              <div style={{
                display: 'inline-block', marginTop: '14px',
                fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                background: `${severityColors[risk.severity]}15`,
                color: severityColors[risk.severity],
                border: `1px solid ${severityColors[risk.severity]}25`,
              }}>
                {risk.severity === 'high' ? '🔴 Yüksek Risk' : risk.severity === 'medium' ? '🟡 Orta Risk' : '🟢 Düşük Risk'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EmergencyFund;
