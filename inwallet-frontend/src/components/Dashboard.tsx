

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-grid">
      
      {/* Top Stats Section */}
      <div className="col-span-12">
        <div className="dashboard-grid">
          <div className="col-span-4 glass-card">
            <div className="card-header">
              <span className="card-title">Toplam Net Değer</span>
            </div>
            <div className="stat-value heading-gradient">₺124,500.00</div>
            <div className="stat-label text-success">+5.2% bu ay</div>
          </div>
          
          <div className="col-span-4 glass-card">
            <div className="card-header">
              <span className="card-title">Aylık Gelir</span>
            </div>
            <div className="stat-value">₺45,000.00</div>
            <div className="stat-label text-muted">Sabit Maaş</div>
          </div>

          <div className="col-span-4 glass-card">
            <div className="card-header">
              <span className="card-title">Aylık Gider</span>
            </div>
            <div className="stat-value">₺18,200.00</div>
            <div className="stat-label text-danger">Kredi & Faturalar</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-8 glass-card" style={{ minHeight: '400px' }}>
        <div className="card-header">
          <span className="card-title">Portföy Dağılımı & Analiz</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-secondary)' }}>
          [Grafik Gelecek: Recharts vb. eklenebilir]
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="col-span-4 glass-card">
        <div className="card-header">
          <span className="card-title">Finansal Hedefler</span>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Ev Peşinatı</span>
            <span className="text-success">45%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '45%', height: '100%', background: 'var(--accent-blue)' }}></div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Araba (Enflasyon Ayarlı)</span>
            <span className="text-muted">12%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '12%', height: '100%', background: 'var(--accent-neon-blue)' }}></div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
