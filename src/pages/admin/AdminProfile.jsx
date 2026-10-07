import React, { useState } from 'react';
import { User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminProfile = () => {
  const { session } = useAuth();
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    setToast('Password updated for session!');
    setPassword('');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="bg-seagreen text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-deep">Admin Security Profile</h1>
        <p className="text-xs text-ink/70">Manage administrator account credentials and session keys.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky max-w-md space-y-4 text-xs">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="w-12 h-12 rounded-full bg-navy-deep text-gold flex items-center justify-center font-serif font-bold text-lg">
            CA
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-navy-deep">{session?.user?.name || 'Captain Administrator'}</h3>
            <p className="text-terracotta font-semibold">{session?.user?.email || 'admin@pacificmarine.demo'}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="block font-bold text-navy-deep mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <button type="submit" className="w-full bg-navy-deep text-gold font-bold py-3 rounded-xl uppercase">
            Update Security Password
          </button>
        </form>
      </div>
    </div>
  );
};
