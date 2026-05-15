import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../services/api';

const News: React.FC = () => {
  const { userId } = useAuth();
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!userId) return;
      try {
        const response = await aiApi.chat(
          Number(userId), 
          "Bana bugünün finans ve ekonomi dünyasından, özellikle yatırımcıları ilgilendiren önemli 3-4 haberi başlıklar ve çok kısa özetler halinde listele. Sadece haberleri ver, başka bir şey yazma."
        );
        setNews(response);
      } catch (err) {
        setNews("Haberler alınırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [userId]);

  return (
    <div className="dashboard-grid animate-fade-in">
      <div className="col-span-12 glass-card" style={{ padding: '40px', minHeight: '60vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            📰
          </div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>Günlük Finans Haberleri</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', marginLeft: '64px' }}>
          AI Asistanınızın sizin için derlediği güncel piyasa gelişmeleri.
        </p>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
            <div className="typing-indicator" style={{ marginBottom: '16px' }}>
              <span></span><span></span><span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Haberler derleniyor...</p>
          </div>
        ) : (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.8', 
            fontSize: '16px', 
            color: 'var(--text-primary)',
            background: 'var(--bg-secondary)',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            {news.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: '10px' }}>
                {line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line) ? (
                  <span style={{ fontWeight: line.includes('**') ? 'bold' : 'normal' }}>
                    {line.replace(/\*\*/g, '')}
                  </span>
                ) : (
                  line.replace(/\*\*/g, '')
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
