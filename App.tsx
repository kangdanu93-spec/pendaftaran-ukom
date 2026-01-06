import React, { useState } from 'react';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import GroupList from './components/GroupList';
import LoginForm from './components/LoginForm';
import { ViewState } from './types';
import { ClipboardList, Users, ArrowRight, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccess(true);
    // Kita tidak redirect otomatis agar siswa bisa melihat link WA
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.FORM:
        return showSuccess ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-fade-in-up">
            <div className="bg-emerald-100 p-4 rounded-full mb-4">
              <ClipboardList className="w-16 h-16 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-600 mb-8">Data kelompok Anda telah tersimpan.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-md w-full mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Langkah Selanjutnya
                </h3>
                <p className="text-green-700 text-sm mb-5">Wajib masuk ke grup WhatsApp untuk informasi UKOM 2026.</p>
                <a 
                  href="https://chat.whatsapp.com/KCxn6OXC4Hw0oSz9Xwgh0K" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                   <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                   Gabung Grup WhatsApp
                </a>
            </div>

            <button 
              onClick={() => {
                setShowSuccess(false);
                setCurrentView(ViewState.LIST);
              }}
              className="text-gray-500 font-medium hover:text-emerald-600 hover:underline transition-colors"
            >
              Lihat Data Peserta &rarr;
            </button>
          </div>
        ) : (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        );
      case ViewState.LIST:
        if (!isLoggedIn) {
          return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
        }
        return <GroupList onLogout={() => setIsLoggedIn(false)} />;
      case ViewState.HOME:
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-20 px-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                Portal Pendaftaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Kelompok UKOM</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">SMK MA Buaranjati 2026</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                Platform digital untuk memudahkan mengelola pembentukan proyek secara efisien.
              </p>
              
              <div className="flex justify-center gap-4 flex-wrap">
                <button 
                  onClick={() => setCurrentView(ViewState.FORM)}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-1"
                >
                  Daftar Sekarang <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentView(ViewState.LIST)}
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 hover:border-emerald-200"
                >
                  <Users className="w-5 h-5" /> Lihat Peserta
                </button>
              </div>
            </div>

            <div className="px-4 mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Langkah-Langkah Pendaftaran</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 text-emerald-600 font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">1</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Isi Biodata</h3>
                  <p className="text-gray-600 leading-relaxed">Klik tombol "Daftar Sekarang", lalu lengkapi Nama Lengkap, Kelas, dan No. WhatsApp yang aktif.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4 text-teal-600 font-bold text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">2</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Pilih Kelompok</h3>
                  <p className="text-gray-600 leading-relaxed">Pilih nomor kelompok yang tersedia. Sistem otomatis membatasi maksimal 7 siswa per kelompok.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-lg hover:border-green-100 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600 font-bold text-xl group-hover:bg-green-600 group-hover:text-white transition-colors">3</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Cek Data Peserta</h3>
                  <p className="text-gray-600 leading-relaxed">Setelah menyimpan, buka menu "Lihat Peserta" untuk memastikan namamu sudah masuk ke dalam kelompok.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 flex flex-col font-sans">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="flex-grow w-full py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} EduSMKMA. Dibuat dengan bangga untuk Pendidikan Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;