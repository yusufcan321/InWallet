import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ShieldAlert, TrendingDown, Lightbulb, Target, ArrowRight, Sparkles, Newspaper } from 'lucide-react';
import { aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InWalletAgent: React.FC = () => {
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

  const triggerAgentAction = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('toggle-ai-chat', { detail: { prompt } }));
  };

  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Otonom Stratejik İçgörü */}
      <div className="col-span-12 glass-card" style={{ padding: '40px', minHeight: '40vh', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-blue), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
          }}>
            <Bot size={32} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900 }}>InWallet Agent</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', marginLeft: '72px' }}>
          Otonom portföy analiziniz ve stratejik finansal asistanınız.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--accent-blue)', display: 'flex' }}><Sparkles size={20} /></span> Stratejik Değerlendirme
        </h2>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '20px 0' }}
            >
              <div className="typing-indicator" style={{ marginBottom: '16px' }}>
                <span></span><span></span><span></span>
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Finansal verileriniz analiz ediliyor... Bu işlem biraz sürebilir.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)' }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {insight.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: '12px' }}>
                    {line.startsWith('-') || line.startsWith('•') ? (
                      <span style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>•</span>
                        {line.substring(1).trim()}
                      </span>
                    ) : line}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ekstra Ajan Yetenekleri */}
      <div className="col-span-12" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>Agent Yetenekleri</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            {
              title: 'Günlük Finans Haberleri',
              desc: 'Portföyünüzdeki şirketler hakkında SPK onayları, temettüler ve önemli haberleri alın.',
              icon: <Newspaper size={20} color="#3b82f6" />,
              prompt: 'Portföyümdeki varlıklar hakkında (örneğin temettü, SPK onayı, şirket haberleri) önemli son gelişmeleri ve günlük finans haberlerini özetle.',
              color: '#3b82f6'
            },
            {
              title: 'Portföy Risk Analizi',
              desc: 'Mevcut varlık dağılımınızın risk profilini inceleyin ve potansiyel tehlikeleri öğrenin.',
              icon: <ShieldAlert size={20} color="#ef4444" />,
              prompt: 'Portföyümün risk analizini yap. Hangi varlıklarda çok fazla risk alıyorum?',
              color: '#ef4444'
            },
            {
              title: 'Harcama Optimizasyonu',
              desc: 'Giderlerinizi analiz ederek nerede tasarruf yapabileceğinizi keşfedin.',
              icon: <TrendingDown size={20} color="#10b981" />,
              prompt: 'Giderlerimi inceleyip bana harcama optimizasyonu önerilerinde bulun.',
              color: '#10b981'
            },
            {
              title: 'Yatırım Fırsatları',
              desc: 'Piyasa koşullarına göre potansiyel yatırım alanlarını agent ile tartışın.',
              icon: <Lightbulb size={20} color="#f59e0b" />,
              prompt: 'Şu anki piyasa koşullarına göre bana 3 farklı yatırım alanı öner. Nedenlerini de açıkla.',
              color: '#f59e0b'
            },
            {
              title: 'Hedef Planlayıcı',
              desc: 'Finansal hedeflerinize ne kadar sürede ulaşabileceğinizi simüle edin.',
              icon: <Target size={20} color="#8b5cf6" />,
              prompt: 'Finansal hedeflerimi incele ve bunlara ulaşmam için gerçekçi bir zaman çizelgesi çıkar.',
              color: '#8b5cf6'
            }
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              className="glass-card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
              onClick={() => triggerAgentAction(action.prompt)}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {action.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{action.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{action.desc}</p>
              <div style={{ marginTop: 'auto', paddingTop: '16px', fontSize: '13px', fontWeight: 600, color: action.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Agent'a Sor <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InWalletAgent;
