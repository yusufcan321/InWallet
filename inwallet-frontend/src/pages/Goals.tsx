import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalApi, userApi } from '../services/api';
import FinancialGoalsModal from '../components/FinancialGoalsModal';

const Goals: React.FC = () => {
  const { userId } = useAuth();
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoalsAndUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const uId = Number(userId);
      const [gData, uData] = await Promise.all([
        goalApi.getGoals(uId).catch(() => []),
        userApi.getMe(uId).catch(() => null)
      ]);
      setGoalsList(Array.isArray(gData) ? gData : []);
      setUserData(uData);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsAndUser();
  }, [userId]);

  const stats = useMemo(() => {
    if (goalsList.length === 0) return { total: 0, completed: 0, avgProgress: 0 };
    const total = goalsList.length;
    const completed = goalsList.filter(g => (Number(g.completionPercentage) || 0) >= 100).length;
    const avgProgress = goalsList.reduce((sum, g) => sum + (Number(g.completionPercentage) || 0), 0) / total;
    return { total, completed, avgProgress };
  }, [goalsList]);

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm("Bu hedefi silmek istediğinize emin misiniz?")) return;
    try {
      await goalApi.deleteGoal(id);
      fetchGoalsAndUser();
    } catch (err) {
      alert("Hedef silinemedi.");
    }
  };

  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Header Section */}
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 800 }} className="heading-gradient">Finansal Hedeflerin</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Hayallerine giden yolda ne kadar yaklaştığını takip et.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 700 }}>
          + Yeni Hedef Ekle
        </button>
      </div>

      {/* Summary Cards */}
      <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>AKTİF HEDEFLER</div>
          <div style={{ fontSize: '36px', fontWeight: 900, marginTop: '12px' }}>{stats.total}</div>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '80px', opacity: 0.05 }}>🎯</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>TAMAMLANAN</div>
          <div style={{ fontSize: '36px', fontWeight: 900, marginTop: '12px', color: 'var(--accent-green)' }}>{stats.completed}</div>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '80px', opacity: 0.05 }}>🏆</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>ORTALAMA İLERLEME</div>
          <div style={{ fontSize: '36px', fontWeight: 900, marginTop: '12px', color: 'var(--accent-blue)' }}>%{Math.round(stats.avgProgress)}</div>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '80px', opacity: 0.05 }}>📈</div>
        </div>
      </div>

      {/* Goals List Section */}
      <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {loading && goalsList.length === 0 ? (
          <div className="col-span-full" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Hedefleriniz yükleniyor...</div>
        ) : goalsList.length === 0 ? (
          <div className="col-span-full glass-card" style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ margin: 0 }}>Henüz bir hedefin yok mu?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Hemen birikim yapmaya başlamak için ilk hedefini oluştur!</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '12px 32px' }}>Şimdi Başla</button>
          </div>
        ) : (
          goalsList.map(goal => {
            const currentAmount = Number(goal.currentAmount || 0);
            const targetAmount = Number(goal.currentTargetPrice || goal.targetAmount || 1);
            const progress = Math.min(100, Number(goal.completionPercentage || (currentAmount / targetAmount * 100) || 0));
            const remaining = Math.max(0, targetAmount - currentAmount);
            
            return (
              <div key={goal.id} className="glass-card animate-hover" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Hedefi Sil"
                >
                  🗑️
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{goal.name}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Hedef Tarih: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('tr-TR') : '---'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>İlerleme Durumu</span>
                    <span style={{ fontWeight: 800, color: progress >= 100 ? 'var(--accent-green)' : 'var(--accent-blue)' }}>%{progress.toFixed(1)}</span>
                  </div>
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${progress}%`, 
                        background: progress >= 100 ? 'var(--accent-green)' : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                        transition: 'width 1s ease-out'
                      }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '4px' }}>BİRİKEN</div>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>₺{currentAmount.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '4px' }}>HEDEF</div>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>₺{targetAmount.toLocaleString()}</div>
                  </div>
                </div>

                {remaining > 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    Hayaline ulaşmak için <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>₺{remaining.toLocaleString()}</span> daha biriktirmelisin.
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--accent-green)', textAlign: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontWeight: 700 }}>
                    🎉 Tebrikler! Hedefine ulaştın.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <FinancialGoalsModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchGoalsAndUser();
        }} 
      />
    </div>
  );
};

export default Goals;
