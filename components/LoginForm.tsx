import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { authenticateUser } from '../services/storageService';
import { AdminUser } from '../types';

interface LoginFormProps {
  onLogin: (user: AdminUser) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authenticateUser(username, password);
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError('Username atau Password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh] px-4 py-8 animate-fade-in-up">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 transform transition-all hover:shadow-[0_25px_70px_-15px_rgba(16,185,129,0.15)] duration-500">
        
        {/* Elegant Header with Deep Gradient */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 px-8 py-12 text-center relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400 opacity-10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl ring-1 ring-white/20 shadow-xl mb-5">
              <ShieldCheck className="w-10 h-10 text-emerald-50" />
            </div>
            
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Akses Guru</h2>
            <p className="text-emerald-100/80 text-sm mt-2 font-light tracking-wide">Portal Data SMK MA Buaranjati</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-10 space-y-6">
          {error && (
            <div className="animate-pulse bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
             {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 focus:bg-white transition-all duration-300 shadow-sm"
                  placeholder="Masukkan username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors duration-300" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 focus:bg-white transition-all duration-300 shadow-sm"
                  placeholder="Masukkan password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-700/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memeriksa...' : 'Masuk Dashboard'}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="text-center mt-8 border-t border-gray-100/80 pt-6">
            <p className="text-gray-400 text-xs flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 
              Sistem Keamanan Terenkripsi
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;