import React from 'react';
import { useTranslation } from 'react-i18next';

const IncomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ExpenseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

interface TransactionFeedProps {
    transactions: any[];
}

const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions }) => {
    const { t } = useTranslation();
    
    const sorted = [...transactions].sort((a, b) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    ).slice(0, 5);

    return (
        <div className="glass-card" style={{ height: '100%' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="card-title">{t('transactions')}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sorted.length > 0 ? sorted.map(tx => {
                    const isIncome = tx.type?.toUpperCase() === 'INCOME';
                    return (
                        <div key={tx.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: isIncome ? '#10b981' : '#ef4444',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {isIncome ? <IncomeIcon /> : <ExpenseIcon />}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{tx.description || tx.type}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(tx.transactionDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div style={{ 
                                fontWeight: 800, 
                                color: isIncome ? '#10b981' : '#ef4444',
                                fontSize: '15px'
                            }}>
                                {isIncome ? '+' : '-'} ₺{tx.amount?.toLocaleString()}
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Henüz işlem yok.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionFeed;
