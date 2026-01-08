import React, { useState, useEffect } from 'react';
import { GroupRegistration, SystemSettings } from '../types';
import { saveRegistration, checkGroupAvailability, subscribeToRegistrations, checkDuplicateStudent, subscribeToSettings } from '../services/storageService';
import { Loader2, Save, FileText, User, School, Phone, Users, AlertCircle, Lock, Clock, Info, Zap } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: () => void;
}

// KONFIGURASI JADWAL OTOMATIS
// Format: YYYY-MM-DDTHH:mm:ss
// Note: Menggunakan waktu lokal browser pengguna (WIB jika user di Indonesia)
const SCHEDULE_START = new Date('2026-01-08T13:00:00');
const SCHEDULE_END = new Date('2026-01-09T23:59:00');

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('');
  const [className, setClassName] = useState('12 MM1');
  const [groupSelection, setGroupSelection] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  
  // Kita simpan data lokal untuk menghitung kuota secara real-time di UI dropdown
  const [registrations, setRegistrations] = useState<GroupRegistration[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({ isRegistrationOpen: true, forceOpen: false });
  
  // State untuk waktu saat ini (untuk auto update status)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Timer untuk update waktu setiap detik agar status buka/tutup realtime
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Subscribe ke data realtime
    const unsubscribeReg = subscribeToRegistrations((data) => {
      setRegistrations(data);
    });

    const unsubscribeSettings = subscribeToSettings((data) => {
      setSettings(data);
      setLoadingInit(false);
    });
    
    // Cleanup listener saat component unmount
    return () => {
      clearInterval(timer);
      unsubscribeReg();
      unsubscribeSettings();
    }
  }, []);

  // Reset pilihan kelompok jika kelas berubah
  useEffect(() => {
    setGroupSelection('');
  }, [className]);

  // --- LOGIKA JADWAL OTOMATIS ---
  const isBeforeOpen = currentTime < SCHEDULE_START;
  const isAfterClose = currentTime > SCHEDULE_END;
  const isScheduleOpen = !isBeforeOpen && !isAfterClose;
  
  // Logic: 
  // 1. Jika Force Open Aktif -> BUKA (Abaikan jadwal & status system enabled)
  // 2. Jika Tidak Force -> Cek (System Enabled AND Schedule Open)
  const isForced = settings.forceOpen === true;
  const isSystemActive = settings.isRegistrationOpen && isScheduleOpen;
  
  const isRegistrationActive = isForced || isSystemActive;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi Data Wajib
    if (!studentName || !gender || !whatsapp || !groupSelection) {
      setError("Mohon lengkapi semua data wajib (*).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Cek apakah pendaftaran masih buka (Prevent bypass)
      
      // Jika TIDAK dalam mode Force Open, lakukan cek jadwal ketat
      if (!settings.forceOpen) {
          if (!settings.isRegistrationOpen) {
            setError("Pendaftaran telah ditutup oleh Admin.");
            setIsSubmitting(false);
            return;
          }
          if (new Date() < SCHEDULE_START) {
            setError("Pendaftaran belum dibuka sesuai jadwal.");
            setIsSubmitting(false);
            return;
          }
          if (new Date() > SCHEDULE_END) {
            setError("Pendaftaran sudah ditutup (melewati batas waktu).");
            setIsSubmitting(false);
            return;
          }
      }

      // Pastikan nama uppercase saat pengecekan duplikasi & penyimpanan
      const finalStudentName = studentName.toUpperCase();

      // 2. Cek DUPLIKASI DATA (Nama & Kelas)
      const isDuplicate = await checkDuplicateStudent(finalStudentName, className);
      if (isDuplicate) {
        setError(`Nama "${finalStudentName}" sudah terdaftar di kelas ${className}. Tidak boleh mendaftar ganda.`);
        setIsSubmitting(false);
        return;
      }

      // 3. Cek ketersediaan server-side sebelum simpan (Double check)
      const status = await checkGroupAvailability(className, groupSelection);
      
      if (status.isFull) {
        setError(`Maaf, ${groupSelection} untuk kelas ${className} baru saja penuh. Silakan pilih kelompok lain.`);
        setIsSubmitting(false);
        return;
      }

      const newRegistration: GroupRegistration = {
        id: '', // ID akan digenerate Firebase
        teamName: groupSelection,
        className,
        studentName: finalStudentName, // SIMPAN SEBAGAI HURUF BESAR
        gender,
        whatsapp,
        createdAt: new Date().toISOString()
      };

      await saveRegistration(newRegistration);
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan ke database. Pastikan koneksi internet lancar atau cek konfigurasi Firebase.");
      setIsSubmitting(false);
    }
  };

  // Helper untuk mendapatkan status opsi dropdown dari data yang sudah di-load
  const getOptionLabel = (num: number) => {
    const gName = `Kelompok ${num}`;
    const count = registrations.filter(r => r.className === className && r.teamName === gName).length;
    
    // Logic: Kelompok 1-5 maks 6 orang, Kelompok 6 maks 7 orang
    const limit = num === 6 ? 7 : 6;
    
    const isFull = count >= limit;
    return {
      label: `${gName} (${count}/${limit} Orang)${isFull ? ' - PENUH' : ''}`,
      value: gName,
      disabled: isFull
    };
  };

  if (loadingInit) {
    return (
      <div className="flex justify-center py-20">
         <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  // TAMPILAN JIKA PENDAFTARAN DITUTUP / BELUM DIBUKA
  if (!isRegistrationActive) {
    let title = "Pendaftaran Ditutup";
    let message = "Formulir tidak tersedia saat ini.";
    let icon = <Lock className="w-12 h-12 text-red-500" />;
    let bgColor = "border-red-100";
    let iconBg = "bg-red-50";

    if (!settings.isRegistrationOpen) {
        // Ditutup manual oleh admin
        message = "Mohon maaf, formulir pendaftaran sedang ditutup sementara oleh Guru/Admin.";
    } else if (isBeforeOpen) {
        // Belum waktunya
        title = "Pendaftaran Belum Dibuka";
        message = "Harap bersabar menunggu jadwal pendaftaran dimulai.";
        icon = <Clock className="w-12 h-12 text-blue-500" />;
        bgColor = "border-blue-100";
        iconBg = "bg-blue-50";
    } else if (isAfterClose) {
        // Sudah lewat
        title = "Pendaftaran Selesai";
        message = "Waktu pendaftaran telah berakhir. Silakan hubungi guru jika belum mendapat kelompok.";
    }

    return (
      <div className={`max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border ${bgColor} animate-fade-in-up text-center p-8 md:p-12`}>
        <div className={`${iconBg} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        
        {/* PESAN JADWAL KHUSUS */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 mb-6 max-w-lg mx-auto">
            <p className="text-gray-800 font-medium leading-relaxed">
                Pendaftaran di buka Hari <span className="font-bold text-emerald-700">Kamis, 08 Januari 2026 Pukul 13.00</span> sampai <span className="font-bold text-red-600">Jum'at 09 Januari 2026 Pukul 23.59</span>
            </p>
        </div>

        <p className="text-gray-500 text-sm max-w-md mx-auto">
          {message}
        </p>

        {isBeforeOpen && (
             <div className="mt-6 text-xs text-gray-400">
                Waktu server saat ini: {currentTime.toLocaleString('id-ID')}
             </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="bg-emerald-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" /> Form Pendaftaran UKOM
        </h2>
        <p className="text-emerald-50 text-sm mt-1">Daftarkan diri Anda ke dalam kelompok. Data tersimpan Online.</p>
      </div>
      
      {/* BANNER JADWAL / FORCE OPEN */}
      {isForced ? (
         <div className="bg-purple-50 border-b border-purple-100 px-6 py-4 flex items-start gap-3">
             <Zap className="w-5 h-5 text-purple-600 mt-0.5 shrink-0 fill-current" />
             <div className="text-sm text-purple-800">
                <p className="font-bold mb-1">Mode Buka Paksa Aktif</p>
                <p className="leading-relaxed">
                    Pendaftaran dibuka manual oleh Admin (Mengabaikan jadwal).
                </p>
             </div>
         </div>
      ) : (
         <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
               <p className="font-bold mb-1">Jadwal Pendaftaran:</p>
               <p className="leading-relaxed">
                   Buka: Kamis, 08 Januari 2026 (13.00) <br/>
                   Tutup: Jum'at, 09 Januari 2026 (23.59)
               </p>
            </div>
         </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border-l-4 border-red-500 flex items-start gap-2 animate-pulse">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Data Diri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value.toUpperCase())} // FORCE UPPERCASE SAAT MENGETIK
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase placeholder:normal-case"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Nama otomatis menjadi huruf kapital.</p>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="" disabled>-- Pilih --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="12 MM1">12 MM1</option>
                  <option value="12 MM2">12 MM2</option>
                </select>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            {/* Pilih Kelompok */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelompok (Kel. 1-5: Maks 6, Kel. 6: Maks 7) *</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={groupSelection}
                  onChange={(e) => setGroupSelection(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${
                    groupSelection && getOptionLabel(parseInt(groupSelection.replace('Kelompok ', '')) || 0).disabled 
                    ? 'border-red-300 text-red-600' : 'border-gray-300'
                  }`}
                >
                  <option value="" disabled>-- Pilih Kelompok --</option>
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const status = getOptionLabel(num);
                    return (
                      <option key={num} value={status.value} disabled={status.disabled} className={status.disabled ? 'text-gray-400 bg-gray-50' : ''}>
                        {status.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kapasitas: Kelompok 1-5 (Max 6), Kelompok 6 (Max 7).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Simpan Permanen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;