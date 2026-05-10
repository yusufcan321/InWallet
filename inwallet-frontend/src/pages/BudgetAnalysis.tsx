import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const income = 45000;
const expense = 18200;
const savings = income - expense;

const needs = expense; // All fixed expenses treated as needs
const wants = 0;        // Assuming no discretionary yet tracked
const investments = savings;

const idealNeeds = income * 0.50;
const idealWants = income * 0.30;
const idealInvestments = income * 0.20;

const segmentsActual = [
  {
    label: 'İhtiyaçlar',
    sublabel: 'Kira, fatura, gıda',
    amount: needs,
    pct: Math.round((needs / income) * 100),
    idealPct: 50,
    color: '#60a5fa',
    ideal: idealNeeds,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'İstekler',
    sublabel: 'Eğlence, yeme-içme',
    amount: wants,
    pct: Math.round((wants / income) * 100),
    idealPct: 30,
    color: '#f59e0b',
    ideal: idealWants,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'Yatırım/Tasarruf',
    sublabel: 'Portföy, hedef birikimi',
    amount: investments,
    pct: Math.round((investments / income) * 100),
    idealPct: 20,
    color: '#10b981',
    ideal: idealInvestments,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
];

const BudgetAnalysis: React.FC = () => {
  const [view, setView] = useState<'breakdown' | 'history'>('breakdown');

  const historyData = [
    { month: 'Oca', needs: 16800, wants: 4200, investments: 24000 },
    { month: 'Şub', needs: 17500, wants: 3500, investments: 24000 },
    { month: 'Mar', needs: 18000, wants: 2000, investments: 25000 },
    { month: 'Nis', needs: 17800, wants: 1800, investments: 25400 },
    { month: 'May', needs: 18200, wants: 0, investments: 26800 },
  ];

  return (
    <div className="dashboard-grid">
      <div className="col-span-12 glass-card animate-slide-up">
        {/* Page Header */}
        <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
              </svg>
            </div>
            50/30/20 Akıllı Bütçe Analizi
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Gelirinizin nereye gittiğini anlayın ve finansal sağlığınızı optimize edin.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
          {[{ id: 'breakdown', label: 'Bu Ay' }, { id: 'history', label: 'Aylık Trend' }].map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id as any)}
              style={{
                padding: '8px 20px', borderRadius: '9px', border: 'none',
                background: view === t.id ? 'var(--bg-primary)' : 'transparent',
                color: view === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: view === t.id ? 700 : 500,
                fontSize: '14px', cursor: 'pointer',
                boxShadow: view === t.id ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === 'breakdown' && (
          <div>
            {/* 50/30/20 Visual */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', height: '20px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                {segmentsActual.map(s => (
                  <div key={s.label} style={{ width: `${s.pct || 1}%`, background: s.color, transition: 'width 0.8s ease' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {segmentsActual.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color }} />
                    {s.label}: <strong style={{ color: s.color }}>%{s.pct}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {segmentsActual.map(s => {
                const diff = s.pct - s.idealPct;
                const overBudget = diff > 0 && s.label !== 'Yatırım/Tasarruf';
                const underBudget = diff < 0 && s.label === 'Yatırım/Tasarruf';
                const status = overBudget || underBudget ? 'warn' : 'good';
                return (
                  <div key={s.label} style={{
                    padding: '24px',
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}25`,
                    borderTop: `4px solid ${s.color}`,
                    borderRadius: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ color: s.color }}>{s.icon}</div>
                      <div style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px',
                        background: status === 'good' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: status === 'good' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${status === 'good' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                      }}>
                        {status === 'good' ? '✓ İdeal' : `${Math.abs(diff) > 0 ? (diff > 0 ? '+' : '') + diff : ''}% sapma`}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6, marginBottom: '12px' }}>{s.sublabel}</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>
                      %{s.pct}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      ₺{s.amount.toLocaleString()} <span style={{ opacity: 0.6 }}>/ ideal %{s.idealPct}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Insight */}
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '14px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: '28px', lineHeight: 1 }}>💡</div>
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '15px', display: 'block', marginBottom: '6px' }}>AI Analiz Notu</strong>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                  <strong>Harika haber:</strong> Yatırım oranın (<strong style={{ color: '#10b981' }}>%{segmentsActual[2].pct}</strong>) 50/30/20 kuralındaki idealin (%20) çok üzerinde!
                  {' '}Ancak gider tablonda <strong style={{ color: '#f59e0b' }}>"İstekler" kategorisinin boş</strong> görünmesi, bazı harcamaların "İhtiyaç" olarak sınıflandırılmış olabileceğine işaret ediyor.
                  {' '}Harcamalarını kategorize ederek gerçek bütçe tablonu çıkar — bu sayede tasarruf oranı potansiyelini daha net görebilirsin.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div>
            <div style={{ height: '320px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    {[
                      { id: 'colorNeeds', color: '#60a5fa' },
                      { id: 'colorWants', color: '#f59e0b' },
                      { id: 'colorInvestments', color: '#10b981' },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={g.color} stopOpacity={0.6} />
                        <stop offset="95%" stopColor={g.color} stopOpacity={0.05} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={13} tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tick={{ fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} tickFormatter={v => `₺${v / 1000}k`} tickMargin={10} />
                  <Tooltip
                    formatter={(val: number, name: string) => [`₺${val.toLocaleString()}`, name === 'needs' ? 'İhtiyaçlar' : name === 'wants' ? 'İstekler' : 'Yatırım']}
                    contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px' }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="needs" stroke="#60a5fa" strokeWidth={2} fill="url(#colorNeeds)" />
                  <Area type="monotone" dataKey="wants" stroke="#f59e0b" strokeWidth={2} fill="url(#colorWants)" />
                  <Area type="monotone" dataKey="investments" stroke="#10b981" strokeWidth={3} fill="url(#colorInvestments)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[{ color: '#60a5fa', label: 'İhtiyaçlar' }, { color: '#f59e0b', label: 'İstekler' }, { color: '#10b981', label: 'Yatırım/Tasarruf' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAnalysis;
