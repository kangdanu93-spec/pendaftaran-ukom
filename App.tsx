import React, { useState } from 'react';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import GroupList from './components/GroupList';
import LoginForm from './components/LoginForm';
import { ViewState } from './types';
import { ClipboardList, Users, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optional: Redirect to LIST, but user will need to login. 
      // Or keep them on form/home. Let's redirect to list so they see the login prompt.
      setCurrentView(ViewState.LIST);
    }, 2000);
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
            <p className="text-gray-600">Data kelompok Anda telah tersimpan.</p>
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
                Portal Pendaftaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Kelompok UKOM (Uji Kompetensi) SMK MA Buaranjati 2026</span>
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