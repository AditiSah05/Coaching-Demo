import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, KeyRound, Mail, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  const handleAutofill = () => {
    setEmail('admin@pacificmarine.demo');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-navy-deep text-ivory flex items-center justify-center p-4 bg-maritime-pattern select-none">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-terracotta text-white flex items-center justify-center mx-auto shadow-terracotta">
            <Anchor className="w-9 h-9" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-white">PACIFIC MARINE</h1>
          <span className="text-xs font-semibold text-sea-blue uppercase tracking-widest block">
            Academy Control Portal
          </span>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-navy-light/60 p-4 rounded-2xl border-2 border-gold/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-terracotta" /> Demo Login Credentials
            </span>
            <button
              onClick={handleAutofill}
              className="bg-gold text-navy-deep px-2.5 py-1 rounded font-bold text-[10px] hover:bg-gold-hover uppercase"
            >
              Autofill Demo
            </button>
          </div>
          <div className="font-mono text-ivory/80 space-y-1">
            <p><strong>Email:</strong> admin@pacificmarine.demo</p>
            <p><strong>Password:</strong> Admin@123</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white text-ink p-8 rounded-3xl shadow-chunky space-y-4">
          
          <h2 className="font-serif text-xl font-bold text-navy-deep text-center border-b pb-2">
            Administrator Sign In
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-deep mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink/40 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pacificmarine.demo"
                  className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-deep mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-ink/40 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-terracotta hover:bg-terracotta-hover text-white font-bold py-3.5 rounded-xl shadow-terracotta text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Login To Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
