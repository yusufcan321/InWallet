import React, { useState, useEffect } from 'react';
import '../components/FinancialGoalsModal.css';
import { useAuth } from '../context/AuthContext';
import { goalApi, userApi } from '../services/api';

const Goals: React.FC = () => {
  const { userId } = useAuth();
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalInflation, setNewGoalInflation] = useState('40'); // Default %40 inflation
  const [newGoalDate, setNewGoalDate] = useState('');

  const fetchGoalsAndUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const uId = Number(userId);
      console.log("Hedefler ve kullanıcı verisi isteniyor. UserID:", uId);
      
      const [gData, uData] = await Promise.all([
        goalApi.getGoals(uId).catch(() => []),
        userApi.getMe(uId).catch(() => null)
      ]);
      
      console.log("Gelen Hedefler:", gData);
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

  const monthlySavings = (userData?.monthlyIncome || 0) - (userData?.monthlyExpense || 0);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    // Tarih formatını backend'in LocalDateTime (YYYY-MM-DDTHH:mm:ss) formatına uyarla
    const formattedDate = newGoalDate ? `${newGoalDate}T00:00:00` : new Date().toISOString().split('.')[0];

    const goalData = {
      name: newGoalTitle,
      initialPrice: Number(newGoalTarget),
      targetAmount: Number(newGoalTarget),
      currentAmount: 0,
      expectedInflationRate: Number(newGoalInflation),
      targetDate: formattedDate,
      user: { id: Number(userId) }
    };

    try {
      console.log("Hedef Kayıt İsteği:", goalData);
      const res = await goalApi.createGoal(goalData);
      console.log("Hedef Kayıt Başarılı:", res);
      
      setNewGoalTitle('');
      setNewGoalTarget('');
      setNewGoalDate('');
      
      // Kayıt sonrası listeyi zorla yenile
      await fetchGoalsAndUser();
      alert("Hedef başarıyla eklendi!");
    } catch (err: any) {
      console.error("Hedef kayıt hatası:", err);
      alert(`Hedef oluşturulamadı: ${err.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm("Bu hedefi silmek istediğinize emin misiniz?")) return;
    try {
      await goalApi.deleteGoal(id);
      fetchGoalsAndUser();
    } catch (err) {
      alert("Hedef silinemedi.");
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Hedefler yükleniyor...</div>;

  return (
    <div className="dashboard-grid">
      <div className="col-span-8 glass-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-title" style={{ fontSize: '24px' }}>Tüm Hedeflerim</span>
          <button 
            onClick={fetchGoalsAndUser}
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--accent-blue)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
          >
            🔄 Yenile
          </button>
        </div>
        
        <div className="goals-list" style={{ marginTop: '20px' }}>
          {goalsList.length > 0 ? goalsList.map(goal => {
            const currentAmount = Number(goal.currentAmount || 0);
            const targetAmount = Number(goal.currentTargetPrice || goal.targetAmount || 1);
            const progress = Number(goal.completionPercentage || (currentAmount / targetAmount * 100) || 0);
            const remainingAmount = targetAmount - currentAmount;
            const etaMonths = monthlySavings > 0 ? Math.ceil(remainingAmount / monthlySavings) : null;

            return (
              <div key={goal.id} className="goal-item animate-slide-up" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '16px', position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}
                  title="Sil"
                >
                  🗑️
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="goal-info">
                    <h4 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}>{goal.name}</h4>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(96, 165, 250, 0.1)', color: 'var(--accent-blue)' }}>
                        %{goal.expectedInflationRate || 0} Enflasyon Ayarlı
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: '30px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₺{Number(goal.currentAmount || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Hedef: ₺{Number(goal.currentTargetPrice || goal.targetAmount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="goal-progress-bar" style={{ height: '14px', marginTop: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '7px' }}>
                  <div 
                    className="goal-progress-fill" 
                    style={{ 
                      width: `${Math.min(100, progress)}%`,
                      background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-neon-blue))',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                    }}
                  ></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    İlerleme: <strong style={{ color: 'var(--accent-blue)' }}>%{progress.toFixed(1)}</strong>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {etaMonths !== null ? (
                      <span>Tahmini Varış (ETA): <strong style={{ color: 'var(--accent-green)' }}>{etaMonths} Ay</strong></span>
                    ) : (
                      <span style={{ color: 'var(--accent-red)' }}>Birikim yetersiz</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Henüz hedef eklenmemiş.</div>
          )}
        </div>
      </div>

      <div className="col-span-4 glass-card">
        <div className="card-header">
          <span className="card-title">Yeni Hedef Ekle</span>
        </div>
        <form className="add-goal-form" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0' }} onSubmit={handleAddGoal}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Hedef Adı</label>
            <input 
              type="text" 
              placeholder="Örn: Tesla Model Y" 
              value={newGoalTitle}
              onChange={e => setNewGoalTitle(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Bugünkü Fiyat (₺)</label>
            <input 
              type="number" 
              placeholder="Örn: 2500000" 
              value={newGoalTarget}
              onChange={e => setNewGoalTarget(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Yıllık Beklenen Enflasyon (%)</label>
            <input 
              type="number" 
              placeholder="Örn: 40" 
              value={newGoalInflation}
              onChange={e => setNewGoalInflation(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Hedef Tarihi</label>
            <input 
              type="date" 
              value={newGoalDate}
              onChange={e => setNewGoalDate(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>Hedefe Başla</button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                <strong>Akıllı Tahmin:</strong> Aylık tasarruf miktarını artırarak (Bütçe Analizi sayfasından) hedeflerine ne kadar daha hızlı ulaşabileceğini görebilirsin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
