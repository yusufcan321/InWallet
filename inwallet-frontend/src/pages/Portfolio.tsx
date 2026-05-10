import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AssetChartModal from '../components/AssetChartModal';

const historyData = [
  { name: 'Oca', value: 102000 },
  { name: 'Şub', value: 106500 },
  { name: 'Mar', value: 104000 },
  { name: 'Nis', value: 112800 },
  { name: 'May', value: 119500 },
  { name: 'Haz', value: 124500 },
];

const projectionData = [
  { year: '2026', reel: 124500, nominal: 124500 },
  { year: '2027', reel: 185000, nominal: 245000 },
  { year: '2028', reel: 260000, nominal: 390000 },
  { year: '2029', reel: 350000, nominal: 580000 },
  { year: '2030', reel: 460000, nominal: 820000 },
  { year: '2031', reel: 590000, nominal: 1150000 },
];

const Portfolio: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'pnl' | 'projection' | 'stress_test' | 'passive_income'>('pnl');
  
  const assets = [
    { name: 'THYAO Hisse (BIST)', symbol: 'THYAO', amount: 55000, avgCost: 280.50, currentPrice: 310.20, shares: 177, profit: '+%10.5', color: '#00d2ff' },
    { name: 'Altın (Gram)', symbol: 'XAU/TRY', amount: 45000, avgCost: 2250.00, currentPrice: 2450.00, shares: 18.36, profit: '+%8.8', color: '#f59e0b' },
    { name: 'Bitcoin (BTC)', symbol: 'BTC/USD', amount: 14500, avgCost: 65000, currentPrice: 62500, shares: 0.007, profit: '-%3.8', color: '#8b5cf6' },
    { name: 'Döviz (USD)', symbol: 'USD/TRY', amount: 10000, avgCost: 31.80, currentPrice: 32.20, shares: 310, profit: '+%1.2', color: '#10b981' },
  ];

  return (
    <div className="dashboard-grid">
      <div className="col-span-12 glass-card animate-slide-up">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '10px' }}>
          <div>
            <span className="card-title" style={{ fontSize: '24px', display: 'block', color: 'var(--text-secondary)' }}>Toplam Portföy Değeri</span>
            <div className="heading-gradient sensitive-data" style={{ fontSize: '38px', fontWeight: '800', marginTop: '8px', letterSpacing: '-1px' }}>₺124,500.00</div>
          </div>
          
          <div className="sensitive-data" style={{ 
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            +%5.2 (Genel)
          </div>
        </div>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('pnl')}
            style={{
              background: 'none', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              color: activeTab === 'pnl' ? 'var(--accent-neon-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'pnl' ? '3px solid var(--accent-neon-blue)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            Canlı Varlık Dağılımı (PnL)
          </button>
          <button 
            onClick={() => setActiveTab('projection')}
            style={{
              background: 'none', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              color: activeTab === 'projection' ? 'var(--accent-neon-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'projection' ? '3px solid var(--accent-neon-blue)' : '3px solid transparent',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            1-5 Yıllık Gelecek Simülasyonu
          </button>
          <button 
            onClick={() => setActiveTab('stress_test')}
            style={{
              background: 'none', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              color: activeTab === 'stress_test' ? 'var(--danger)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'stress_test' ? '3px solid var(--danger)' : '3px solid transparent',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Piyasa Kriz Senaryosu
          </button>
          <button 
            onClick={() => setActiveTab('passive_income')}
            style={{
              background: 'none', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              color: activeTab === 'passive_income' ? 'var(--accent-green)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'passive_income' ? '3px solid var(--accent-green)' : '3px solid transparent',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            Pasif Gelir Endeksi
          </button>
        </div>
        
        {activeTab === 'pnl' && (
          <div className="animate-slide-up">
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)', animation: 'pulse 2s infinite' }}></span>
              Canlı Piyasa Verileri
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
              {assets.map((asset, index) => {
                const isProfit = asset.profit.startsWith('+');
                const pnlAmount = asset.amount - (asset.amount / (1 + parseFloat(asset.profit.replace('%', '').replace('+', '').replace('-', '')) / 100));
                
                return (
                <div 
                  key={index} 
                  className="col-span-6"
                  style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    padding: '24px', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    borderTop: `4px solid ${asset.color}`,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                  onClick={() => setSelectedAsset(asset)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px ${asset.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>{asset.name}</h4>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>{asset.shares.toLocaleString()} Adet • {asset.symbol}</div>
                    </div>
                    <div style={{ 
                      background: isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: isProfit ? 'var(--success)' : 'var(--danger)', 
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isProfit ? '▲' : '▼'} {asset.profit}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Maliyet / Anlık (₺)</div>
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>{asset.avgCost.toFixed(2)} / <span style={{ color: isProfit ? 'var(--success)' : 'var(--danger)' }}>{asset.currentPrice.toFixed(2)}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Gerçekleşmemiş PnL</div>
                      <div className="sensitive-data" style={{ fontSize: '18px', fontWeight: 800, color: isProfit ? 'var(--success)' : 'var(--danger)' }}>
                        {isProfit ? '+' : ''}₺{Math.abs(pnlAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {activeTab === 'projection' && (
          <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 700, fontSize: '20px' }}>Yapay Zeka Destekli Projeksiyon</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '6px 0 0 0' }}>Mevcut yatırımlarınızın ve aylık 15.000₺ tasarrufunuzun 5 yıllık simülasyonu.</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-neon-blue)' }}></div> Reel (Enflasyondan Arındırılmış)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(59, 130, 246, 0.3)' }}></div> Nominal (Beklenen)</span>
              </div>
            </div>
            
            <div style={{ height: '350px', marginTop: '20px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-neon-blue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={14} tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} tickLine={false} axisLine={false} tickMargin={15} />
                  <YAxis stroke="var(--text-secondary)" fontSize={13} tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val/1000}k`} tickMargin={15} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`₺${value.toLocaleString()}`, name === 'reel' ? 'Reel Getiri' : 'Nominal Getiri']}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}
                    contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '16px' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '15px', padding: '4px 0' }}
                  />
                  <Area type="monotone" dataKey="nominal" stroke="rgba(59, 130, 246, 0.4)" strokeWidth={2} fillOpacity={1} fill="url(#colorNominal)" />
                  <Area type="monotone" dataKey="reel" stroke="var(--accent-neon-blue)" strokeWidth={4} fillOpacity={1} fill="url(#colorReel)" style={{ filter: 'drop-shadow(0 4px 12px rgba(96, 165, 250, 0.4))' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: 'var(--accent-neon-blue)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <p style={{ margin: 0 }}><strong>Yapay Zeka Notu:</strong> Hedeflediğiniz 'Ev Peşinatı' tutarına (500.000 ₺) enflasyon etkilerinden arındırılmış reel getiri bazında <strong>2029 yılı sonunda</strong> ulaşmanız öngörülmektedir. Hisse senedi ağırlığını %10 artırırsanız bu süre 8 ay kısalabilir.</p>
            </div>
          </div>
        )}

        {activeTab === 'stress_test' && (
          <div className="animate-slide-up">
            <h4 style={{ color: 'var(--danger)', marginBottom: '24px', fontWeight: 700, fontSize: '20px' }}>Piyasa Kriz Simülasyonu</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
              <div className="col-span-4" style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h5 style={{ color: 'var(--danger)', margin: '0 0 12px 0', fontSize: '16px' }}>Borsa Çöküş Senaryosu</h5>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>BIST 100 endeksi aniden %20 değer kaybederse mevcut varlıklarınıza etkisi:</p>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>₺102,800</div>
                <div style={{ fontSize: '14px', color: 'var(--danger)', marginTop: '8px', fontWeight: 600 }}>-₺21,700 Kayıp</div>
              </div>

              <div className="col-span-8" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px' }}>🛡️</div>
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Risk Analizi & AI Yorumu</h5>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      Borsadaki olası bir %20'lik düşüşte, portföyünüzün %36'sını oluşturan <strong>Altın (Gram)</strong> ve <strong>Döviz (USD)</strong> kriz yastığı görevi görecektir. <br/><br/>
                      Altın/Döviz ikilisi bu şoku büyük ölçüde emeceği için <strong>toplam portföy kaybınız %20 değil, yalnızca %17.4 ile sınırlı kalacaktır.</strong> Ev hedefinize ulaşmanız sadece 4 ay gecikir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'passive_income' && (
          <div className="animate-slide-up">
            <h4 style={{ color: 'var(--accent-green)', marginBottom: '24px', fontWeight: 700, fontSize: '20px' }}>Finansal Özgürlük ve Pasif Gelir</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Bu Ay Üretilen Pasif Gelir (Bileşik Getiri)</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Portföyünüz sizin hiçbir eforunuz olmadan çalışarak şu kadarlık değer üretti:</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '-1px' }}>+₺6,800.00</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>Sadece bu ayki değer artışı</div>
                </div>
              </div>

              <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                  Finansal Özgürlük Endeksi
                </h5>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid rgba(16, 185, 129, 0.2)', borderTopColor: 'var(--accent-green)', borderRightColor: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'var(--accent-green)', transform: 'rotate(-45deg)' }}>
                    <span style={{ transform: 'rotate(45deg)' }}>%40</span>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                      Tebrikler! Portföyünüzün bu ayki getirisi, ülkemizdeki <strong>asgari ücretin tam %40'ına</strong> denk geliyor. Yani çalışmasanız bile asgari ücretin neredeyse yarısı kadar maaş elde etmiş oldunuz. Hedef: %100!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AssetChartModal 
        isOpen={selectedAsset !== null} 
        onClose={() => setSelectedAsset(null)} 
        asset={selectedAsset} 
      />
    </div>
  );
};

export default Portfolio;
