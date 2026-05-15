import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';

const Profile: React.FC = () => {
  const { userId, updateUserInfo } = useAuth();
  
  // Profile edit state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!userId) return;
    userApi.getMe(Number(userId)).then(d => {
      setEditFirstName(d?.firstName || '');
      setEditLastName(d?.lastName || '');
      setEditUsername(d?.username || '');
      setEditEmail(d?.email || '');
    }).catch(() => {});
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword) { setMsg({ type: 'error', text: 'Mevcut şifrenizi girin.' }); return; }
      if (newPassword !== confirmPassword) { setMsg({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' }); return; }
      if (newPassword.length < 6) { setMsg({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' }); return; }
    }

    setIsSaving(true);
    setMsg(null);
    try {
      const updated = await userApi.updateMe(Number(userId), {
        firstName: editFirstName,
        lastName: editLastName,
        username: editUsername,
        email: editEmail,
      });


      if (oldPassword && newPassword) {
        await userApi.changePassword(Number(userId), oldPassword, newPassword);
        setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      }

      setMsg({ type: 'success', text: 'Bilgiler başarıyla güncellendi.' });
      updateUserInfo({
        firstName: updated.firstName || null,
        lastName: updated.lastName || null,
        username: updated.username,
      });
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Güncelleme başarısız.' });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (editFirstName[0] || editUsername[0] || 'U').toUpperCase();

  return (
    <div className="dashboard-grid animate-fade-in">
      <div className="col-span-12 glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: 'white', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}>
            {initials}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>Profil Ayarları</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Hesap bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.</p>
          </div>
        </div>

        {msg && (
          <div style={{
            padding: '15px', borderRadius: '12px', marginBottom: '24px',
            background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${msg.type === 'success' ? 'var(--accent-green)' : '#ef4444'}`,
            color: msg.type === 'success' ? 'var(--accent-green)' : '#ef4444',
            fontWeight: 600
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSave} style={{ maxWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>AD</label>
              <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="text" value={editFirstName} onChange={e => setEditFirstName(e.target.value)} placeholder="Adınız" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>SOYAD</label>
              <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="text" value={editLastName} onChange={e => setEditLastName(e.target.value)} placeholder="Soyadınız" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>KULLANICI ADI</label>
              <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>E-POSTA</label>
              <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Şifre Değiştir</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>MEVCUT ŞİFRE</label>
                <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Değiştirmek istemiyorsanız boş bırakın" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>YENİ ŞİFRE</label>
                <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="input-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>YENİ ŞİFRE (TEKRAR)</label>
                <input className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSaving}
            style={{ marginTop: '40px', width: '200px', height: '50px', fontSize: '16px' }}
          >
            {isSaving ? 'Güncelleniyor...' : 'Bilgileri Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
