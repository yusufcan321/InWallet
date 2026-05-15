import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AIAgenticInsights: React.FC = () => {
  const { userId } = useAuth();
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!userId) return;
      
      const cached = sessionStorage.getItem(`ai_insight_${userId}`);
      if (cached) {
        setInsight(cached);
        setLoading(false);
        return;
      }
      
      try {
        const data = await aiApi.getAutonomousInsight(Number(userId));
        setInsight(data);
        sessionStorage.setItem(`ai_insight_${userId}`, data);
      } catch (err) {
        setInsight('İçgörü alınamadı. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [userId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Premium Glow Effect */}
      <div style={{ 
        position: 'absolute', 
        top: '-50px', 
        right: '-50px', 
        width: '150px', 
        height: '150px', 
        background: 'rgba(59, 130, 246, 0.2)', 
        filter: 'blur(50px)', 
        borderRadius: '50%' 
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: 'var(--accent-blue)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          <span style={{ fontSize: '20px' }}>✨</span>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>AI Stratejik İçgörü</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Otonom Agentic Analiz</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '20px 0' }}
          >
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '10px' }}>
              Finansal verileriniz analiz ediliyor...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-primary)' }}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {insight.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: '10px' }}>
                  {line.startsWith('-') || line.startsWith('•') ? (
                    <span style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>•</span>
                      {line.substring(1).trim()}
                    </span>
                  ) : line}
                </p>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-secondary" 
                style={{ fontSize: '11px', padding: '6px 12px' }}
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
              >
                Asistanla Detaylandır →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAgenticInsights;
