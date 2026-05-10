import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Asset {
  name: string;
  amount: string;
  profit: string;
  color: string;
}

interface AssetChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const generateMockData = (asset: Asset) => {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
  
  // Clean string and parse to number (e.g. "₺55,000.00" -> 55000)
  const finalValue = parseFloat(asset.amount.replace(/[^\d.-]/g, ''));
  // Clean profit string and parse (e.g. "+%8.4" -> 8.4)
  const profitStr = asset.profit.replace('%', '').replace('+', '');
  const profitPercent = parseFloat(profitStr);
  
  // Calculate starting value based on the total 6-month profit
  const startValue = finalValue / (1 + (profitPercent / 100));
  
  const data = [];
  const isCrypto = asset.name.includes('Kripto');
  const volatility = isCrypto ? 0.08 : 0.03; // Crypto fluctuates more
  
  for (let i = 0; i < months.length - 1; i++) {
    // Linear progression step
    const expectedVal = startValue + ((finalValue - startValue) * (i / 5));
    // Add random noise to make it look like a real chart
    const noise = expectedVal * (Math.random() * volatility - (volatility / 2));
    data.push({ name: months[i], value: Math.round(expectedVal + noise) });
  }
  
  // Force the final month to exactly match the current portfolio value
  data.push({ name: months[5], value: finalValue });
  
  return data;
};

const AssetChartModal: React.FC<AssetChartModalProps> = ({ isOpen, onClose, asset }) => {
  if (!isOpen || !asset) return null;

  // Use useMemo to avoid re-generating data on every render of the open modal
  const data = React.useMemo(() => generateMockData(asset), [asset.name, asset.amount]);

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className="glass-card modal-content" onClick={e => e.stopPropagation()} style={{
        width: '90%', maxWidth: '650px', padding: '30px', position: 'relative',
        boxShadow: `0 0 30px ${asset.color}30`
      }}>
        <button className="close-btn" onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: '28px', cursor: 'pointer', transition: 'color 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          ×
        </button>
        
        <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: 'var(--text-primary)' }}>{asset.name}</h3>
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Son 6 Aylık Performans & Trend Analizi
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Mevcut Değerleme</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{asset.amount}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Toplam Kar/Zarar</div>
            <div style={{ 
              fontSize: '20px', fontWeight: 'bold',
              color: asset.profit.startsWith('+') ? 'var(--success)' : 'var(--danger)'
            }}>
              {asset.profit.startsWith('+') ? '▲' : '▼'} {asset.profit}
            </div>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="assetColorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={asset.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={asset.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={13} tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} tickLine={false} axisLine={false} tickMargin={10} padding={{ left: 15, right: 15 }} />
              <YAxis stroke="var(--text-secondary)" fontSize={13} tick={{ fill: 'var(--text-secondary)', fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${Math.round(val/1000)}k`} tickMargin={10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <Tooltip 
                formatter={(value: number) => `₺${value.toLocaleString()}`}
                contentStyle={{ background: 'var(--bg-secondary)', border: `1px solid ${asset.color}80`, borderRadius: '8px', boxShadow: `0 4px 20px ${asset.color}40` }}
                itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke={asset.color} strokeWidth={4} fillOpacity={1} fill="url(#assetColorValue)" style={{ filter: `drop-shadow(0 0 10px ${asset.color}80)` }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AssetChartModal;
