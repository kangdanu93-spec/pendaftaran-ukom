import React, { useState } from 'react';
import { getRegistrationsOnce } from '../services/storageService';
import { GroupRegistration } from '../types';
import { Search, Loader2, User, Users, GraduationCap, AlertCircle, Calendar } from 'lucide-react';

const StudentStatusCheck: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroupRegistration | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName) return;

    setLoading(true);
    setSearched(false);
    setError('');
    setResult(null);

    try {
      const allData = await getRegistrationsOnce();
      
      const cleanInput = searchName.toLowerCase().trim();

      // Cari berdasarkan Nama Lengkap (Case Insensitive)
      // Mengambil data pertama yang cocok
      const found = allData.find(student => 
        student.studentName.toLowerCase().trim() === cleanInput
      );

      if (found) {
        setResult(found);
      } else {
        setError('Nama tidak ditemukan. Pastikan ejaan nama sama persis dengan saat pendaftaran.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Coba lagi nanti.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Cek Status & Nilai</h2>
        <p className="text-gray-500">Masukkan <strong>Nama Lengkap</strong> Anda untuk melihat hasil UKOM.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 backdrop-blur-sm transition-all text-lg font-medium"
              placeholder="Contoh: Ahmad Syaiful"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek'}
            </button>
          </form>
        </div>

        <div className="p-6 min-h-[200px] flex flex-col items-center justify-center">
          {loading && (
             <div className="flex flex-col items-center gap-2 text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
               <p>Mencari data siswa...</p>
             </div>
          )}

          {!loading && searched && !result && (
            <div className="text-center text-gray-500 animate-fade-in">
              <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                 <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Tidak Ditemukan</h3>
              <p className="text-sm mt-1 max-w-xs mx-auto">{error}</p>
            </div>
          )}

          {!loading && result && (
            <div className="w-full animate-fade-in-up">
              {/* Score Card Header */}
              <div className="text-center mb-6">
                 {result.score !== undefined ? (
                    <div className="inline-block relative">
                       <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black border-4 shadow-lg ${
                         result.score >= 75 
                           ? 'bg-green-100 border-green-500 text-green-700' 
                           : 'bg-orange-100 border-orange-500 text-orange-700'
                       }`}>
                         {result.score}
                       </div>
                       {result.score >= 75 && (
                         <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-yellow-200">
                           LULUS
                         </div>
                       )}
                    </div>
                 ) : (
                    <div className="bg-gray-100 text-gray-400 w-24 h-24 rounded-full flex items-center justify-center border-4 border-gray-200 mx-auto">
                       <span className="text-xs font-bold text-center leading-tight">BELUM<br/>DINILAI</span>
                    </div>
                 )}
                 <h3 className="mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Hasil Nilai Akhir</h3>
              </div>

              {/* Detail List */}
              <div className="space-y-4 border-t pt-4">
                 <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                       <p className="text-xs text-gray-500 font-semibold uppercase">Nama Peserta</p>
                       <p className="text-gray-900 font-bold text-lg">{result.studentName}</p>
                       <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">{result.gender}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                        <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-xs text-blue-600 font-semibold uppercase">Kelas</p>
                            <p className="text-gray-900 font-bold">{result.className}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                        <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                            <p className="text-xs text-purple-600 font-semibold uppercase">Tim</p>
                            <p className="text-gray-900 font-bold">{result.teamName}</p>
                        </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 p-3 text-xs text-gray-400 justify-center border-t border-dashed mt-2">
                    <Calendar className="w-4 h-4" />
                    Terdaftar pada: {new Date(result.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </div>
              </div>

              <div className="mt-6 text-center">
                <button 
                    onClick={() => setSearched(false)}
                    className="text-gray-500 text-sm font-medium hover:text-emerald-600 underline"
                >
                    Cek Nama Lain
                </button>
              </div>
            </div>
          )}

          {!loading && !searched && !result && (
             <div className="text-center text-gray-400 py-4 opacity-50">
                <Search className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Silakan masukkan Nama Lengkap untuk mencari.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentStatusCheck;