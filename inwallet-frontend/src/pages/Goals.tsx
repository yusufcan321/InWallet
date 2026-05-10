import React, { useState } from 'react';
import '../components/FinancialGoalsModal.css';

interface Goal {
  id: number;
  title: string;
  originalTarget: number;
  current: number;
  inflationRate: number;
  icon: string;
}

const getProgressColor = (progress: number) => {
  if (progress < 25) return 'var(--danger, #ef4444)';
  if (progress < 60) return '#f59e0b';
  if (progress < 85) return 'var(--accent-blue, #3b82f6)';
  return 'var(--success, #10b981)';
};

const getGoalIcon = (iconType: string, color: string) => {
  if (iconType === 'home') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.08)' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
  );
  if (iconType === 'car') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.12)', border: '1px solid rgba(96, 165, 250, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(96, 165, 250, 0.08)' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2.5"/>
        <path d="M9.5 17h5"/>
        <circle cx="17" cy="17" r="2.5"/>
      </svg>
    </div>
  );
  if (iconType === 'travel') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.08)' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5.5L6.5 16 3 15l-1 1 4 4 1-1-1-3.5 2.5-2.5L14 21l1.2-.7c.4-.2.7-.6.6-1.1z"/>
      </svg>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', marginRight: '16px', color: color, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  );
};

const Goals: React.FC = () => {
  const [goalsList, setGoalsList] = useState<Goal[]>([
    { id: 1, title: 'Ev Peşinatı', originalTarget: 500000, current: 225000, inflationRate: 0.45, icon: 'home' },
    { id: 2, title: 'Araba', originalTarget: 300000, current: 36000, inflationRate: 0.28, icon: 'car' },
    { id: 3, title: 'Yaz Tatili', originalTarget: 50000, current: 15000, inflationRate: 0.05, icon: 'travel' },
  ]);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalInflation, setNewGoalInflation] = useState('10');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now(),
      title: newGoalTitle,
      originalTarget: Number(newGoalTarget),
      current: 0,
      inflationRate: Number(newGoalInflation) / 100,
      icon: 'default'
    };
    setGoalsList([...goalsList, newGoal]);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalInflation('10');
  };

  return (
    <div className="dashboard-grid">
      <div className="col-span-8 glass-card animate-slide-up">
        <div className="card-header" style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <span className="card-title" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Enflasyon Endeksli Hedeflerim
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '6px 0 0 0' }}>Hedef tutarlarınız dinamik olarak güncel piyasa koşullarına göre yeniden hesaplanır.</p>
          </div>
        </div>
        
        <div className="goals-list" style={{ marginTop: '20px', gap: '24px' }}>
          {goalsList.map((goal, index) => {
            const adjustedTarget = goal.originalTarget * (1 + goal.inflationRate);
            const inflationImpact = adjustedTarget - goal.originalTarget;
            const progress = adjustedTarget > 0 ? (goal.current / adjustedTarget) * 100 : 0;
            const originalProgress = goal.originalTarget > 0 ? (goal.current / goal.originalTarget) * 100 : 0;
            const color = getProgressColor(progress);
            
            return (
              <div 
                key={goal.id} 
                className="goal-item" 
                style={{ 
                  padding: '24px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.4s ease forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                <div className="goal-info" style={{ marginBottom: '20px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', margin: 0, fontSize: '18px', fontWeight: 600 }}>
                    {getGoalIcon(goal.icon, color)}
                    {goal.title}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                      ₺{goal.current.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', textDecoration: 'line-through', opacity: 0.7 }}>
                      İlk Hedef: ₺{goal.originalTarget.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--danger)', marginTop: '2px', fontWeight: 600 }}>
                      Güncel: ₺{adjustedTarget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                
                <div className="goal-progress-bar" style={{ height: '10px', background: 'var(--bg-primary)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                  {/* Original Target Marker */}
                  <div style={{ position: 'absolute', left: `${originalProgress}%`, top: 0, bottom: 0, width: '2px', background: 'var(--text-secondary)', zIndex: 10 }}></div>
                  <div 
                    className="goal-progress-fill" 
                    style={{ 
                      width: `${progress}%`, 
                      background: color,
                      height: '100%',
                      borderRadius: '5px',
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease'
                    }}
                  ></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tamamlanan: <span style={{ color: color }}>%{progress.toFixed(1)}</span></span>
                  <span style={{ color: 'var(--danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Enflasyon Farkı: +₺{inflationImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                {goal.inflationRate > 0.20 && (
                  <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>🧠</span>
                    <p style={{ margin: 0 }}><strong>AI Asistan:</strong> Bu hedefin yıllık bazda enflasyon etkisi oldukça yüksek (%{(goal.inflationRate*100).toFixed(0)}). Hedefe ulaşmak için altın veya döviz bazlı tasarruf yapmanız veya aylık birikiminizi artırmanız önerilir.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="col-span-4 glass-card animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <div className="card-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Yeni Hedef Ekle
          </span>
        </div>
        <form className="add-goal-form" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0' }} onSubmit={handleAddGoal}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Hedef Adı</label>
            <div style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <input 
                type="text" 
                placeholder="Örn: Dünya Turu" 
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                required 
                style={{ width: '100%', padding: '14px 14px 14px 42px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Hedef Tutarı (₺)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600 }}>₺</span>
              <input 
                type="number" 
                placeholder="Örn: 100000" 
                value={newGoalTarget}
                onChange={e => setNewGoalTarget(e.target.value)}
                required 
                style={{ width: '100%', padding: '14px 14px 14px 42px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>Beklenen Yıllık Enflasyon (%)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600 }}>%</span>
              <input 
                type="number" 
                placeholder="Örn: 15" 
                value={newGoalInflation}
                onChange={e => setNewGoalInflation(e.target.value)}
                required 
                style={{ width: '100%', padding: '14px 14px 14px 42px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--accent-blue)', color: 'white', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Hedefe Başla
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Goals;
