import React, { useState, useRef } from 'react';

interface SettingsProps {
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  profile?: { name: string; email: string };
  onProfileChange?: (p: { name: string; email: string }) => void;
  isPrivacyMode?: boolean;
  onPrivacyModeChange?: (v: boolean) => void;
  aiEnabled?: boolean;
  onAiEnabledChange?: (v: boolean) => void;
  currency?: string;
  onCurrencyChange?: (v: string) => void;
  autoTheme?: boolean;
  onAutoThemeChange?: (v: boolean) => void;
  sunTimes?: { sunrise: string; sunset: string; city: string } | null;
}

const Settings: React.FC<SettingsProps> = ({
  currentTheme = 'dark', onThemeChange,
  profile: profileProp, onProfileChange,
  isPrivacyMode = false, onPrivacyModeChange,
  aiEnabled = true, onAiEnabledChange,
  currency = 'TRY', onCurrencyChange,
  autoTheme = false, onAutoThemeChange,
  sunTimes = null,
}) => {
  const [goalNotifications, setGoalNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const [show2FA, setShow2FA] = useState(false);
  const [phone2FA, setPhone2FA] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [phase2FA, setPhase2FA] = useState<'phone' | 'code'>('phone');
  const [codeError, setCodeError] = useState(false);
  const d0 = useRef<HTMLInputElement>(null);
  const d1 = useRef<HTMLInputElement>(null);
  const d2 = useRef<HTMLInputElement>(null);
  const d3 = useRef<HTMLInputElement>(null);
  const digitRefs = [d0, d1, d2, d3];

  // Profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localProfile, setLocalProfile] = useState({ name: 'Sami Eren', email: 'sami@inwallet.app' });
  const profile = profileProp ?? localProfile;
  const [editBuffer, setEditBuffer] = useState({ name: '', email: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const initials = profile.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const editInitials = editBuffer.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  const showToast = (msg: string, color = '#10b981') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSave = () => {
    if (!editBuffer.name.trim() || !editBuffer.email.trim()) return;
    const updated = { name: editBuffer.name.trim(), email: editBuffer.email.trim() };
    if (onProfileChange) onProfileChange(updated); else setLocalProfile(updated);
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGoalNotifications = (val: boolean) => {
    setGoalNotifications(val);
    if (val) {
      if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification('InWallet Hatırlatıcı ✅', { body: 'Haftalık hedef bildirimleri aktif edildi!' });
            showToast('✅ Bildirim izni verildi, hatırlatıcılar aktif!');
          } else {
            setGoalNotifications(false);
            showToast('⚠️ Tarayıcı bildirim izni reddedildi.', '#f59e0b');
          }
        });
      } else {
        showToast('⚠️ Tarayıcınız bildirim desteklemiyor.', '#f59e0b');
        setGoalNotifications(false);
      }
    } else {
      showToast('Hedef hatırlatıcıları kapatıldı.', '#64748b');
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Tarih', 'Açıklama', 'Tür', 'Tutar', 'Para Birimi'],
      ['2026-05-01', 'Maaş', 'Gelir', '45000', currency],
      ['2026-05-03', 'Kira', 'Gider', '-8500', currency],
      ['2026-05-05', 'Elektrik/Su', 'Gider', '-1200', currency],
      ['2026-05-10', 'Altın Alım', 'Yatırım', '-5000', currency],
      ['2026-05-10', 'BIST Hisse', 'Yatırım', '-3000', currency],
      ['2026-05-15', 'Freelance Proje', 'Gelir', '15000', currency],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `inwallet_islemler_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('📥 CSV dosyası indirildi!');
  };

  const handle2FAToggle = (val: boolean) => {
    if (val) { setShow2FA(true); setPhase2FA('phone'); setPhone2FA(''); setDigits(['','','','']); setCodeError(false); }
    else { setTwoFactorAuth(false); showToast('2FA kapatıldı.', '#64748b'); }
  };

  const send2FACode = () => {
    if (phone2FA.replace(/\D/g,'').length < 10) { showToast('Geçerli bir telefon numarası girin.', '#f59e0b'); return; }
    setPhase2FA('code');
    setDigits(['','','','']);
    setCodeError(false);
    showToast('📱 Doğrulama kodu gönderildi (test: 1234)');
    setTimeout(() => d0.current?.focus(), 120);
  };

  const handleDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g,'').slice(-1);
    const next = [...digits]; next[i] = v;
    setDigits(next); setCodeError(false);
    if (v && i < 3) digitRefs[i + 1].current?.focus();
    if (next.every(d => d) && next.join('') === '1234') setTimeout(() => finalize2FA(next.join('')), 150);
  };

  const handleDigitKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) digitRefs[i - 1].current?.focus();
  };

  const finalize2FA = (code: string) => {
    if (code === '1234') {
      setTwoFactorAuth(true); setShow2FA(false);
      showToast('✅ İki faktörlü doğrulama aktif edildi!');
    } else {
      setCodeError(true);
      setDigits(['','','','']);
      setTimeout(() => d0.current?.focus(), 50);
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width: '50px', height: '28px', background: checked ? 'var(--accent-blue)' : 'rgba(255,255,255,0.15)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', boxShadow: checked ? '0 0 10px rgba(59,130,246,0.5)' : 'none', flexShrink: 0 }}>
      <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '24px' : '2px', transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
    </div>
  );

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, outline: 'none', boxSizing: 'border-box' };

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>{children}</div>
  );

  const SettingRow = ({ label, desc, checked, onChange, last = false }: { label: string; desc: string; checked: boolean; onChange: () => void; last?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{desc}</div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div className="dashboard-grid">
      <div className="col-span-12 glass-card">
        {/* Global Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 99999, padding: '12px 20px', background: toast.color + '18', border: `1px solid ${toast.color}40`, borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: toast.color, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', animation: 'slideIn 0.3s ease' }}>
            {toast.msg}
          </div>
        )}

        {/* 2FA Modal */}
        {show2FA && (
          <div className="modal-overlay open" onClick={() => setShow2FA(false)} style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999 }}>
            <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', width: '95%', padding: 0, background: 'var(--bg-primary)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)' }}>

              {/* Modal Header */}
              <div style={{ padding: '0', background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
                <div style={{ padding: '28px 28px 24px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>İki Faktörlü Doğrulama</h3>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '3px' }}>
                        {phase2FA === 'phone' ? 'Adım 1 / 2 — Telefon numarası' : 'Adım 2 / 2 — Kod doğrulama'}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShow2FA(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>×</button>
                </div>
                {/* Step dots */}
                <div style={{ padding: '0 28px 20px', display: 'flex', gap: '6px' }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{ height: '3px', flex: 1, borderRadius: '2px', background: (phase2FA === 'phone' ? i === 0 : true) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)', transition: 'background 0.4s ease' }} />
                  ))}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '28px' }}>
                {phase2FA === 'phone' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>📱 Telefon Numarası</label>
                      <input type="tel" value={phone2FA} onChange={e => setPhone2FA(e.target.value)} onKeyDown={e => e.key === 'Enter' && send2FACode()} placeholder="+90 5XX XXX XX XX" style={{ ...inputStyle, fontSize: '16px', letterSpacing: '1px' }} autoFocus />
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', opacity: 0.7 }}>SMS ile 4 haneli doğrulama kodu gönderilecek.</div>
                    </div>
                    <button onClick={send2FACode} style={{ padding: '14px', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 16px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Kod Gönder
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>📱</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Kodunuzu girin</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{phone2FA}</span> numarasına gönderildi
                      </div>
                    </div>

                    {/* OTP Digit Boxes */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      {digits.map((d, i) => (
                        <input
                          key={i}
                          ref={digitRefs[i]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          onChange={e => handleDigit(i, e.target.value)}
                          onKeyDown={e => handleDigitKey(i, e)}
                          style={{
                            width: '60px', height: '68px',
                            textAlign: 'center',
                            fontSize: '28px', fontWeight: 900,
                            background: d ? 'rgba(59,130,246,0.12)' : 'var(--bg-secondary)',
                            border: `2px solid ${codeError ? '#ef4444' : d ? '#3b82f6' : 'var(--border-color)'}`,
                            borderRadius: '14px',
                            color: codeError ? '#ef4444' : 'var(--text-primary)',
                            outline: 'none',
                            cursor: 'text',
                            transition: 'all 0.2s ease',
                            boxShadow: d && !codeError ? '0 0 0 3px rgba(59,130,246,0.15)' : codeError ? '0 0 0 3px rgba(239,68,68,0.15)' : 'none',
                            animation: codeError ? 'shake 0.4s ease' : 'none',
                          }}
                        />
                      ))}
                    </div>

                    {codeError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#ef4444', width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                        ❌ Yanlış kod. Tekrar deneyin.
                        <span style={{ opacity: 0.7, fontWeight: 400 }}>(ipucu: 1234)</span>
                      </div>
                    )}

                    <button
                      onClick={() => finalize2FA(digits.join(''))}
                      disabled={digits.some(d => !d)}
                      style={{ width: '100%', padding: '14px', background: digits.every(d => d) ? 'linear-gradient(135deg,#059669,#10b981)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '12px', color: digits.every(d => d) ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: '15px', cursor: digits.every(d => d) ? 'pointer' : 'not-allowed', boxShadow: digits.every(d => d) ? '0 4px 16px rgba(16,185,129,0.35)' : 'none', transition: 'all 0.25s ease' }}
                    >
                      ✅ Doğrula ve Aktif Et
                    </button>

                    <button onClick={() => setPhase2FA('phone')} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '13px', cursor: 'pointer', fontWeight: 600, padding: '4px' }}>
                      ← Telefon numarasını değiştir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card-header" style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
          <span className="card-title" style={{ fontSize: '26px', display: 'block', color: 'var(--text-primary)' }}>Ayarlar ve Tercihler</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>Hesap güvenliğinizi, bildirimlerinizi ve uygulama deneyiminizi yönetin.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Profile */}
            <section>
              <h3 style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Profil Bilgileri</h3>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {!isEditingProfile ? (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-neon-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#fff', boxShadow: '0 6px 16px rgba(59,130,246,0.4)' }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{profile.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>{profile.email}</div>
                      <div style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>✓ Premium Üye</div>
                    </div>
                    <button onClick={() => { setEditBuffer({ name: profile.name, email: profile.email }); setIsEditingProfile(true); setSaveSuccess(false); }} style={{ padding: '8px 16px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✏️ Düzenle</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '18px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-neon-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 'bold', color: '#fff' }}>{editInitials}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Profili düzenle</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input type="text" value={editBuffer.name} onChange={e => setEditBuffer(b => ({ ...b, name: e.target.value }))} placeholder="Ad Soyad" style={inputStyle} />
                      <input type="email" value={editBuffer.email} onChange={e => setEditBuffer(b => ({ ...b, email: e.target.value }))} placeholder="E-posta" style={inputStyle} />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleProfileSave} disabled={!editBuffer.name.trim() || !editBuffer.email.trim()} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Kaydet</button>
                        <button onClick={() => setIsEditingProfile(false)} style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>İptal</button>
                      </div>
                    </div>
                    {saveSuccess && <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#10b981' }}>✅ Güncellendi!</div>}
                  </div>
                )}
              </div>
            </section>

            {/* Security */}
            <section>
              <h3 style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Güvenlik ve Gizlilik</h3>
              <SectionCard>
                <SettingRow label="Biyometrik Giriş (Face ID)" desc={biometricLogin ? '✅ Tercih kaydedildi (web\'de desteklenmez)' : 'Uygulamaya girişte yüz tanıma kullan.'} checked={biometricLogin} onChange={() => { setBiometricLogin(v => !v); showToast(!biometricLogin ? 'Biyometrik tercih kaydedildi.' : 'Biyometrik giriş kapatıldı.', '#60a5fa'); }} />
                <SettingRow label="İki Faktörlü Doğrulama (2FA)" desc={twoFactorAuth ? '✅ 2FA aktif — hesabınız korumalı' : 'SMS doğrulamasıyla hesap güvenliği.'} checked={twoFactorAuth} onChange={() => handle2FAToggle(!twoFactorAuth)} />
                <SettingRow label="Varsayılan Gizlilik Modu" desc={isPrivacyMode ? '✅ Bakiyeler şu an gizli' : 'Tüm tutarları blur ile gizle.'} checked={isPrivacyMode} onChange={() => { onPrivacyModeChange?.(!isPrivacyMode); showToast(!isPrivacyMode ? '🙈 Gizlilik modu açıldı' : '👁️ Gizlilik modu kapatıldı', '#a78bfa'); }} last />
              </SectionCard>
            </section>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section>
              <h3 style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Görünüm ve Bildirimler</h3>

              {/* ☀️ Auto-Theme Card */}
              <div style={{
                marginBottom: '12px',
                padding: '20px',
                background: autoTheme
                  ? (currentTheme === 'dark'
                    ? 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))'
                    : 'linear-gradient(135deg, rgba(254,240,138,0.15), rgba(251,191,36,0.1))')
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${autoTheme ? (currentTheme === 'dark' ? 'rgba(99,102,241,0.3)' : 'rgba(251,191,36,0.35)') : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '16px',
                transition: 'all 0.5s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: autoTheme && sunTimes ? '16px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Animated sun/moon icon */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: autoTheme
                        ? (currentTheme === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(251,191,36,0.2)')
                        : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px',
                      transition: 'all 0.5s ease',
                      boxShadow: autoTheme && currentTheme === 'light' ? '0 0 20px rgba(251,191,36,0.3)' : 'none',
                    }}>
                      {autoTheme ? (currentTheme === 'dark' ? '🌙' : '☀️') : '🌓'}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Akıllı Otomatik Tema</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {autoTheme
                          ? (sunTimes
                            ? `${sunTimes.city} · ${currentTheme === 'dark' ? '🌙 Hava karanlık' : '☀️ Hava aydınlık'}`
                            : 'Konum alınıyor...')
                          : 'Gün doğumu/batımına göre tema değişir'}
                      </div>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={autoTheme}
                    onChange={() => {
                      onAutoThemeChange?.(!autoTheme);
                      if (!autoTheme) showToast('🌓 Otomatik tema aktif — konum izni gerekebilir', '#a78bfa');
                      else showToast('Otomatik tema kapatıldı.', '#64748b');
                    }}
                  />
                </div>

                {/* Sun times display */}
                {autoTheme && sunTimes && (
                  <div style={{
                    display: 'flex', gap: '10px',
                    paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {[
                      { icon: '🌅', label: 'Gün Doğumu', value: sunTimes.sunrise, color: '#f59e0b' },
                      { icon: '🌇', label: 'Gün Batımı', value: sunTimes.sunset, color: '#8b5cf6' },
                      { icon: '📍', label: 'Konum', value: sunTimes.city, color: '#60a5fa' },
                    ].map(item => (
                      <div key={item.label} style={{
                        flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px', border: `1px solid ${item.color}20`, textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: item.color }}>{item.value}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', opacity: 0.7 }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {autoTheme && !sunTimes && (
                  <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid var(--accent-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                    Konum alınıyor, tema hesaplanıyor...
                  </div>
                )}
              </div>

              <SectionCard>
                <SettingRow label="Karanlık Mod (Dark Mode)" desc={autoTheme ? '🔒 Otomatik tema açıkken manuel değiştirilemez' : (currentTheme === 'dark' ? '✅ Koyu tema aktif' : 'Açık temaya geçmek için kapatın.')} checked={currentTheme === 'dark'} onChange={() => { if (autoTheme) { showToast('Önce Otomatik Temayı kapatın.', '#f59e0b'); return; } onThemeChange?.(currentTheme === 'dark' ? 'light' : 'dark'); showToast(currentTheme === 'dark' ? '☀️ Açık tema aktif' : '🌙 Koyu tema aktif', '#60a5fa'); }} />
                <SettingRow label="Yapay Zeka (AI) Asistanı" desc={aiEnabled ? '✅ AI sohbet butonu görünür' : 'AI butonu gizlendi.'} checked={aiEnabled} onChange={() => { onAiEnabledChange?.(!aiEnabled); showToast(!aiEnabled ? '🤖 AI Asistanı açıldı' : 'AI Asistanı gizlendi', '#a78bfa'); }} />
                <SettingRow label="Hedef Hatırlatıcıları" desc={goalNotifications ? '✅ Tarayıcı bildirimleri aktif' : 'İzin verince haftalık hatırlatıcı gönderilir.'} checked={goalNotifications} onChange={() => handleGoalNotifications(!goalNotifications)} last />
              </SectionCard>
            </section>

            <section>
              <h3 style={{ color: 'var(--accent-neon-blue)', marginBottom: '16px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>Finansal Ayarlar</h3>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Varsayılan Para Birimi</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Seçim tüm portföy değerlemelerine uygulanır.</div>
                  </div>
                  <select
                    value={currency}
                    onChange={e => { onCurrencyChange?.(e.target.value); showToast(`💱 Para birimi: ${e.target.value}`, '#60a5fa'); }}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="TRY">₺ Türk Lirası (TRY)</option>
                    <option value="USD">$ Amerikan Doları (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                    <option value="GBP">£ İngiliz Sterlini (GBP)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Banka ve Borsa Bağlantıları</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>API entegrasyonu — yakında geliyor.</div>
                  </div>
                  <button onClick={() => showToast('🔜 Banka entegrasyonu yakında aktif!', '#f59e0b')} style={{ padding: '7px 14px', background: 'var(--accent-neon-blue)', border: 'none', borderRadius: '8px', color: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Yönet</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Verileri Dışa Aktar</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Tüm işlemlerinizi CSV formatında indirin.</div>
                  </div>
                  <button onClick={handleExportCSV} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    İndir
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
