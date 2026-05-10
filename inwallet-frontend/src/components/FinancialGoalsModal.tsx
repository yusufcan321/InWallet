import React, { useState } from 'react';
import './FinancialGoalsModal.css';

interface FinancialGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const goals = [
  { id: 1, title: 'Ev Peşinatı', target: 500000, current: 225000, inflationRate: 0.45, icon: 'home', color: 'var(--accent-blue)' },
  { id: 2, title: 'Araba (Enflasyon Ayarlı)', target: 300000, current: 36000, inflationRate: 0.12, icon: 'car', color: 'var(--accent-neon-blue)' },
  { id: 3, title: 'Yaz Tatili', target: 50000, current: 15000, inflationRate: 0.05, icon: 'travel', color: 'var(--accent-green)' }
];

const getProgressColor = (progress: number) => {
  if (progress < 25) return 'var(--danger, #ef4444)';
  if (progress < 60) return '#f59e0b';
  if (progress < 85) return 'var(--accent-blue, #3b82f6)';
  return 'var(--success, #10b981)';
};

const FinancialGoalsModal: React.FC<FinancialGoalsModalProps> = ({ isOpen, onClose }) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  if (!isOpen) return null;

  const renderIcon = (iconType: string, color: string) => {
    if (iconType === 'home') return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.08)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    );
    if (iconType === 'car') return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.12)', border: '1px solid rgba(96, 165, 250, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(96, 165, 250, 0.08)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2.5"/>
          <path d="M9.5 17h5"/>
          <circle cx="17" cy="17" r="2.5"/>
        </svg>
      </div>
    );
    if (iconType === 'travel') return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', marginRight: '16px', color: color, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.08)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5.5L6.5 16 3 15l-1 1 4 4 1-1-1-3.5 2.5-2.5L14 21l1.2-.7c.4-.2.7-.6.6-1.1z"/>
        </svg>
      </div>
    );
    return null;
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // Geliştirmede buraya API çağrısı eklenecek
    alert(`Yeni hedef eklendi: ${newGoalTitle} - ${newGoalTarget}`);
    setNewGoalTitle('');
    setNewGoalTarget('');
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content animate-slide-up">
        <div className="modal-header">
          <h3 className="card-title">Finansal Hedeflerim</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="goals-list">
            {goals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              const color = getProgressColor(progress);
              return (
                <div key={goal.id} className="goal-item">
                  <div className="goal-info">
                    <h4 style={{ display: 'flex', alignItems: 'center', margin: 0, fontSize: '16px' }}>
                      {renderIcon(goal.icon || '', goal.color || 'var(--text-primary)')}
                      {goal.title}
                    </h4>
                    <span className="goal-stats">
                      ₺{goal.current.toLocaleString()} / ₺{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="goal-progress-bar">
                    <div 
                      className="goal-progress-fill" 
                      style={{ width: `${progress}%`, background: color }}
                    ></div>
                  </div>
                  <div className="goal-footer" style={{ color: color, fontWeight: 500 }}>
                    İlerleme: %{progress.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>

          <form className="add-goal-form" onSubmit={handleAddGoal}>
            <h4>Yeni Hedef Ekle</h4>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Hedef Adı (örn: Tatil)" 
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="number" 
                placeholder="Hedef Tutar (₺)" 
                value={newGoalTarget}
                onChange={e => setNewGoalTarget(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-primary">Hedef Ekle</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoalsModal;
