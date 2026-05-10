import React from 'react';

interface SavingsRateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavingsRateModal: React.FC<SavingsRateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-content glass-card animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', padding: '32px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--text-primary)' }}>Tasarruf Hızı Nedir?</h2>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Finansal Özgürlüğün Altın Kuralı</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer', padding: '4px' }}>×</button>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px', lineHeight: '1.6', fontSize: '15px', color: 'var(--text-secondary)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Tasarruf Hızı (Savings Rate)</strong>, aylık net gelirinizin ne kadarlık bir kısmını harcamayıp yatırıma yönlendirdiğinizi gösteren en kritik finansal metriktir.
          </p>
          <p style={{ margin: 0 }}>
            Hedeflerinize (ev almak, emeklilik vb.) ne kadar sürede ulaşacağınızı maaşınızın yüksekliği değil, tasarruf hızınız belirler.
            Mevcut <strong style={{ color: 'var(--accent-green)' }}>%59.5</strong> olan tasarruf oranınız, gelirinizin yarıdan fazlasını servet inşasına ayırdığınızı gösteriyor. Bu muazzam bir oran!
          </p>
        </div>

        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎯</span> Hedefi %65'e Çıkarmak İçin Taktikler
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <div style={{ fontSize: '24px' }}>🤖</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>1. "Kendine Öde" Kuralını Otomatize Et</h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Maaş yattığı gün, faturaları beklemeden belirlediğiniz yatırım tutarını otomatik ödeme talimatıyla yatırım hesabınıza aktarın. Kalan paraya göre yaşama alışkanlığı edinin.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <div style={{ fontSize: '24px' }}>✂️</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>2. Görünmez Giderleri (Abonelikler) Kesin</h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Aylık gider tablonuza (18.200₺) göre kredi ve fatura yükünüz yüksek. Nadir kullanılan dijital platform üyeliklerini iptal etmek veya plan düşürmek tasarruf oranınızı hızlıca %2 artırabilir.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', background: 'rgba(139, 92, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <div style={{ fontSize: '24px' }}>📈</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>3. Gelir Artışlarını Tamamen Yatırıma Kaydırın</h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Zam aldığınızda veya planlanmış "Freelance Proje (15.000₺)" gibi ek gelirler geldiğinde, yaşam standartlarınızı hemen artırmak yerine bu ek miktarın %90'ını doğrudan portföye ekleyin.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--accent-green)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            marginTop: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          Anladım, Uygulamaya Başla
        </button>
      </div>
    </div>
  );
};

export default SavingsRateModal;
