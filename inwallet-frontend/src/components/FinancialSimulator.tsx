import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialSimulator: React.FC = () => {
  const [amount, setAmount] = useState<number>(50000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(25); // %25 yıllık getiri
  const [type, setType] = useState<'expense' | 'investment'>('investment');

  const simulationData = useMemo(() => {
    const data = [];
    const rateDecimal = rate / 100;

    for (let i = 0; i <= years; i++) {
      const projected = amount * Math.pow(1 + rateDecimal, i);
      data.push({
        year: `${i}. Yıl`,
        value: Math.round(projected),
      });
    }
    return data;
  }, [amount, years, rate]);

  const finalValue = simulationData[simulationData.length - 1].value;
  const growth = finalValue - amount;

  return (
    <div className="dashboard-grid" style={{ padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 glass-card"
        style={{ marginBottom: '24px' }}
      >
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Finansal Karar Simülatörü</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bir harcamanın veya yatırımın uzun vadeli etkisini simüle ederek geleceğinizi planlayın.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-4 glass-card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>İşlem Tipi</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setType('investment')}
                className={type === 'investment' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1 }}
              >
                Yatırım
              </button>
              <button 
                onClick={() => setType('expense')}
                className={type === 'expense' ? 'btn-danger' : 'btn-secondary'}
                style={{ flex: 1 }}
              >
                Harcama
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              {type === 'investment' ? 'Yatırım Tutarı' : 'Harcama Tutarı'} (₺)
            </label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="ai-chat-input"
              style={{ width: '100%', padding: '12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Süre (Yıl): {years}</label>
            <input 
              type="range" 
              min="1" max="30" 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Beklenen Yıllık Getiri (%): {rate}</label>
            <input 
              type="range" 
              min="1" max="100" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Visual Result */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-8 glass-card"
      >
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase' }}>
            {years} Yıl Sonraki Etki
          </h4>
          <div style={{ fontSize: '36px', fontWeight: 900, color: type === 'investment' ? 'var(--accent-green)' : '#ef4444' }}>
            ₺{finalValue.toLocaleString()}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {type === 'investment' ? 
              `Bu yatırımı yaparsanız kümülatif büyümeniz ₺${growth.toLocaleString()} olacaktır.` : 
              `Bu harcamayı yapmazsanız, aynı tutarın yatırım potansiyeli ₺${finalValue.toLocaleString()} olacaktır.`
            }
          </p>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulationData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={type === 'investment' ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={type === 'investment' ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${(val/1000)}k`} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                formatter={(value: any) => [`₺${value.toLocaleString()}`, 'Gelecek Değer']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={type === 'investment' ? '#10b981' : '#ef4444'} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialSimulator;
