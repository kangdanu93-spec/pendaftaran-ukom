import React, { useState } from 'react';
import { Lock, ArrowRight, User, KeyRound, ShieldCheck, GraduationCap, School } from 'lucide-react';
import { authenticateUser } from '../services/storageService';
import { AdminUser } from '../types';

interface GatekeeperProps {
  onUnlock: (user?: AdminUser) => void;
}

const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  
  // Student State
  const [studentCode, setStudentCode] = useState('');
  
  // Admin State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // HARDCODED STUDENT ACCESS CODE
  const STUDENT_ACCESS_CODE = 'ukom2026';

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
        if (studentCode.toLowerCase().trim() === STUDENT_ACCESS_CODE) {
            onUnlock(); // Unlock without user (Guest/Student mode)
        } else {
            setError('Kode akses salah. Silakan tanya Guru Komputer.');
            setIsLoading(false);
        }
    }, 800);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authenticateUser(username, password);
      
      if (result.success && result.user) {
        onUnlock(result.user); // Unlock WITH admin user
      } else {
        setError('Username atau Password salah.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center px-4 py-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10">
                 <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner border border-white/20">
                    <Lock className="w-8 h-8 text-white" />
                 </div>
                 <h1 className="text-2xl font-black text-white tracking-tight">Portal UKOM 2026</h1>
                 <p className="text-emerald-100 text-sm mt-1">SMKS Mathla'ul Anwar Buaranjati</p>
             </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => { setActiveTab('student'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'student' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <GraduationCap className="w-4 h-4" /> Siswa
            </button>
            <button 
                onClick={() => { setActiveTab('admin'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <ShieldCheck className="w-4 h-4" /> Guru / Admin
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-start gap-2 animate-pulse border border-red-100">
                    <div className="mt-0.5 min-w-[16px]"><Lock className="w-4 h-4" /></div>
                    {error}
                </div>
            )}

            {activeTab === 'student' ? (
                <form onSubmit={handleStudentLogin} className="space-y-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm">Masukkan <strong className="text-emerald-600">Kode Akses</strong> kelas untuk masuk ke aplikasi.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Kode Akses</label>
                        <div className="relative">
                            <input 
                                type="password" // Password type so it's hidden
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-bold text-gray-700 tracking-widest placeholder:font-normal placeholder:tracking-normal"
                                placeholder="Masukkan Kode"
                                autoFocus
                            />
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Memeriksa...' : <>Masuk Aplikasi <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleAdminLogin} className="space-y-5">
                     <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm">Login khusus untuk Guru atau Admin.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Username Admin"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Password Admin"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Memproses...' : <>Login Dashboard <ShieldCheck className="w-4 h-4" /></>}
                    </button>
                </form>
            )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
             <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                <School className="w-3 h-3" /> SMKS Mathla'ul Anwar Buaranjati
             </div>
        </div>
      </div>
    </div>
  );
};

export default Gatekeeper;