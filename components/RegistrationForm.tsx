import React, { useState, useEffect } from 'react';
import { GroupRegistration } from '../types';
import { saveRegistration, checkGroupAvailability, subscribeToRegistrations } from '../services/storageService';
import { Loader2, Save, FileText, User, School, Phone, Users, AlertCircle } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('');
  const [className, setClassName] = useState('12 MM1');
  const [groupSelection, setGroupSelection] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Kita simpan data lokal untuk menghitung kuota secara real-time di UI dropdown
  const [registrations, setRegistrations] = useState<GroupRegistration[]>([]);

  useEffect(() => {
    // Subscribe ke data realtime agar jika ada orang lain daftar, 
    // kuota di dropdown langsung terupdate
    const unsubscribe = subscribeToRegistrations((data) => {
      setRegistrations(data);
    });
    
    // Cleanup listener saat component unmount
    return () => unsubscribe();
  }, []);

  // Reset pilihan kelompok jika kelas berubah
  useEffect(() => {
    setGroupSelection('');
  }, [className]);

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
      // Cek ketersediaan server-side sebelum simpan (Double check)
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
        studentName,
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="bg-emerald-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" /> Form Pendaftaran UKOM
        </h2>
        <p className="text-emerald-50 text-sm mt-1">Daftarkan diri Anda ke dalam kelompok. Data tersimpan Online.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border-l-4 border-red-500 flex items-start gap-2">
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
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
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