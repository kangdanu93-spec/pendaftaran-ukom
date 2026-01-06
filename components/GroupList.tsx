import React, { useEffect, useState } from 'react';
import { GroupRegistration, AdminUser, SystemSettings } from '../types';
import { subscribeToRegistrations, deleteRegistration, clearAllRegistrations, updateRegistration, subscribeToSettings, updateSystemSettings } from '../services/storageService';
import { Users, Trash2, Phone, School, LogOut, FileSpreadsheet, Database, Shield, GraduationCap, Check, Lock, Unlock, AlertTriangle, Search, X, Printer } from 'lucide-react';
import UserManagement from './UserManagement';

interface GroupListProps {
  currentUser: AdminUser;
  onLogout: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ currentUser, onLogout }) => {
  const [registrations, setRegistrations] = useState<GroupRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({ isRegistrationOpen: true });
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Mode Penilaian
  const [isGradingMode, setIsGradingMode] = useState(false);
  // State lokal untuk menyimpan input nilai sementara sebelum disave per user
  const [tempScores, setTempScores] = useState<Record<string, string>>({});
  const [savingScoreId, setSavingScoreId] = useState<string | null>(null);

  // State untuk Modal Hapus
  const [studentToDelete, setStudentToDelete] = useState<GroupRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Berlangganan data realtime dari Firebase
    const unsubscribeReg = subscribeToRegistrations((data) => {
      setRegistrations(data);
      setIsLoading(false);
    });

    const unsubscribeSettings = subscribeToSettings((data) => {
      setSettings(data);
    });

    // Bersihkan langganan saat komponen ditutup
    return () => {
      unsubscribeReg();
      unsubscribeSettings();
    }
  }, []);

  const initiateDelete = (student: GroupRegistration) => {
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteRegistration(studentToDelete.id);
      setStudentToDelete(null); // Tutup modal otomatis karena data realtime akan update
    } catch (e) {
      alert("Gagal menghapus data. Cek koneksi internet.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
     if (window.confirm('BAHAYA: Ini akan menghapus SEMUA data di Database Server. Data tidak bisa dikembalikan. Lanjutkan?')) {
      try {
        await clearAllRegistrations();
      } catch (e) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const toggleRegistrationStatus = async () => {
    try {
      await updateSystemSettings({ isRegistrationOpen: !settings.isRegistrationOpen });
    } catch (e) {
      alert("Gagal mengubah status pendaftaran.");
    }
  };

  const handleScoreChange = (id: string, value: string) => {
    // Hanya izinkan angka
    if (!/^\d*$/.test(value)) return;
    // Maksimal 100
    if (parseInt(value) > 100) return;
    
    setTempScores(prev => ({
        ...prev,
        [id]: value
    }));
  };

  const handleSaveScore = async (id: string) => {
    const val = tempScores[id];
    if (val === undefined || val === '') return; // Tidak ada perubahan atau kosong

    setSavingScoreId(id);
    try {
        await updateRegistration(id, { score: parseInt(val) });
        // Hapus dari temp setelah sukses
        setTempScores(prev => {
            const next = {...prev};
            delete next[id];
            return next;
        });
    } catch (e) {
        console.error(e);
        alert("Gagal menyimpan nilai");
    } finally {
        setSavingScoreId(null);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    // Header CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama Lengkap,Jenis Kelamin,Kelas,Kelompok,No WhatsApp,Nilai UKOM,Waktu Daftar\n";

    // Data Rows
    registrations.forEach((row) => {
      const rowData = [
        `"${row.id}"`,
        `"${row.studentName}"`,
        `"${row.gender || '-'}"`,
        `"${row.className}"`,
        `"${row.teamName}"`,
        `"${row.whatsapp}"`,
        `"${row.score !== undefined ? row.score : 'Belum Dinilai'}"`,
        `"${row.createdAt}"`
      ].join(",");
      csvContent += rowData + "\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_nilai_ukom_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Grouping logic
  const classes = ['12 MM1', '12 MM2'];
  const groupNumbers = [1, 2, 3, 4, 5, 6];

  // Filtering Logic
  const filteredRegistrations = searchTerm 
    ? registrations.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.teamName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : registrations;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-10">
      {/* Modal User Management */}
      {showUserManagement && <UserManagement onClose={() => setShowUserManagement(false)} />}

      {/* MODAL KONFIRMASI HAPUS SISWA */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in print:hidden">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-fade-in-up border border-gray-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Siswa?</h3>
                    <div className="bg-gray-50 rounded-lg p-3 w-full mb-4 border border-gray-100">
                        <p className="font-bold text-gray-800 text-lg">{studentToDelete.studentName}</p>
                        <p className="text-sm text-gray-500">{studentToDelete.className} • {studentToDelete.teamName}</p>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Tindakan ini akan menghapus data siswa secara permanen dari database. Kuota kelompok akan bertambah kembali.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setStudentToDelete(null)}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Header Admin - HIDDEN ON PRINT */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:hidden">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-600" />
              Dashboard Admin
            </h2>
            {currentUser.role === 'superadmin' && (
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                SUPER
              </span>
            )}
           </div>
          <div className="flex items-center gap-2 mt-1">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-sm text-gray-500">
               Total Siswa: <strong>{registrations.length}</strong>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto">
             {/* SEARCH BAR */}
            <div className="relative w-full md:w-auto md:mr-2">
               <input 
                 type="text" 
                 placeholder="Cari nama siswa..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full md:w-64 pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
               />
               <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
               {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3 h-3" />
                 </button>
               )}
            </div>

            <button
              onClick={toggleRegistrationStatus}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                settings.isRegistrationOpen 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              {settings.isRegistrationOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            <button 
                onClick={() => setIsGradingMode(!isGradingMode)}
                className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    isGradingMode 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-200' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700'
                }`}
                title="Input Nilai"
            >
                <GraduationCap className="w-4 h-4" /> 
            </button>

            {currentUser.role === 'superadmin' && (
              <button 
                onClick={() => setShowUserManagement(true)}
                className="px-3 py-2.5 text-gray-700 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 rounded-xl text-sm font-bold transition-all"
                title="Kelola Admin"
              >
                 <Shield className="w-4 h-4" />
              </button>
            )}

            <button 
              onClick={handlePrint}
              className="px-3 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold transition-all"
              title="Cetak Halaman"
            >
               <Printer className="w-4 h-4" />
            </button>

            <button 
              onClick={handleExportCSV}
              className="px-3 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl text-sm font-bold transition-all"
              title="Download Excel"
            >
               <FileSpreadsheet className="w-4 h-4" />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>
            
            <button 
              onClick={onLogout}
              className="px-3 py-2.5 text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl text-sm font-medium transition-colors"
            >
               <LogOut className="w-4 h-4" />
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
             <p className="text-gray-500 text-sm">Menghubungkan ke database...</p>
          </div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Database Kosong</h3>
        </div>
      ) : (
        <div className="space-y-12">
          {/* JIKA SEDANG SEARCHING, TAMPILKAN TABEL DAFTAR */}
          {searchTerm ? (
             <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex justify-between">
                    <span>Hasil Pencarian: "{searchTerm}"</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{filteredRegistrations.length} ditemukan</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Kelas</th>
                                <th className="px-6 py-3">Kelompok</th>
                                <th className="px-6 py-3">Nilai</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{reg.studentName}</td>
                                    <td className="px-6 py-4">{reg.className}</td>
                                    <td className="px-6 py-4">{reg.teamName}</td>
                                    <td className="px-6 py-4 font-bold">
                                        {reg.score ? <span className="text-emerald-600">{reg.score}</span> : <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => initiateDelete(reg)} className="text-red-600 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">Tidak ada data yang cocok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
          ) : (
            // NORMAL VIEW (GROUP CARDS)
            classes.map(className => (
                <div key={className} className="animate-fade-in break-inside-avoid">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-emerald-100 print:border-black">
                    <div className="bg-emerald-100 p-2 rounded-lg print:hidden">
                    <School className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 print:text-black">Kelas {className}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
                    {groupNumbers.map(num => {
                    const teamName = `Kelompok ${num}`;
                    const teamMembers = registrations.filter(r => r.className === className && r.teamName === teamName);
                    const limit = num === 6 ? 7 : 6;
                    const isFull = teamMembers.length >= limit;
                    const isEmpty = teamMembers.length === 0;

                    return (
                        <div key={teamName} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 break-inside-avoid ${isFull ? 'border-orange-200' : 'border-gray-200'} print:border-gray-300 print:shadow-none`}>
                        {/* Card Header */}
                        <div className={`px-5 py-4 border-b flex justify-between items-center ${
                            isFull ? 'bg-gradient-to-r from-orange-50 to-white' : 
                            isEmpty ? 'bg-gray-50' : 'bg-gradient-to-r from-emerald-50/50 to-white'
                        } print:bg-gray-100`}>
                            <h3 className={`font-bold ${isFull ? 'text-orange-800' : 'text-gray-800'} print:text-black`}>{teamName}</h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm print:border print:border-gray-400 print:text-black print:bg-transparent ${
                            isFull ? 'bg-orange-100 text-orange-700' : 
                            isEmpty ? 'bg-gray-200 text-gray-500' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {teamMembers.length} / {limit}
                            </span>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-5 min-h-[160px] print:min-h-0">
                            {teamMembers.length > 0 ? (
                            <ul className="space-y-4 print:space-y-2">
                                {teamMembers.map((member, idx) => {
                                    const isSaving = savingScoreId === member.id;
                                    const currentInputValue = tempScores[member.id] !== undefined ? tempScores[member.id] : (member.score?.toString() || '');
                                    
                                    return (
                                    <li key={member.id} className="flex flex-col gap-1 text-sm group border-b border-gray-50 pb-2 last:border-0 last:pb-0 print:border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3 w-full">
                                            <span className="text-gray-400 w-4 font-mono text-right flex-shrink-0 pt-0.5 print:text-black">{idx + 1}.</span>
                                            <div className="w-full">
                                                <div className="flex justify-between w-full">
                                                    <span className="font-semibold text-gray-700 flex items-center gap-2 print:text-black">
                                                        {member.studentName}
                                                        {member.gender && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold print:hidden ${member.gender === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                                {member.gender === 'Laki-laki' ? 'L' : 'P'}
                                                            </span>
                                                        )}
                                                        <span className="hidden print:inline text-[10px] font-normal">({member.gender === 'Laki-laki' ? 'L' : 'P'})</span>
                                                    </span>
                                                    
                                                    {/* TOMBOL HAPUS - HIDE ON PRINT */}
                                                    {!isGradingMode && (
                                                        <button
                                                            onClick={() => initiateDelete(member)}
                                                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-all print:hidden"
                                                            title="Hapus Siswa"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <div className="flex justify-between items-end mt-1">
                                                    <span className="text-[11px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit print:text-gray-600 print:bg-transparent print:p-0">
                                                        <Phone className="w-3 h-3 print:hidden" /> {member.whatsapp}
                                                    </span>

                                                    {/* SCORE DISPLAY / INPUT */}
                                                    <div className="flex items-center">
                                                        {isGradingMode ? (
                                                            <div className="flex items-center gap-1 print:hidden">
                                                                <input 
                                                                    type="text"
                                                                    className="w-12 h-8 text-center border border-gray-300 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-bold"
                                                                    placeholder="0"
                                                                    value={currentInputValue}
                                                                    onChange={(e) => handleScoreChange(member.id, e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleSaveScore(member.id);
                                                                    }}
                                                                />
                                                                <button 
                                                                    onClick={() => handleSaveScore(member.id)}
                                                                    disabled={isSaving}
                                                                    className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                                                                >
                                                                    {isSaving ? <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span> : <Check className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            member.score !== undefined ? (
                                                                <span className={`text-xs font-bold px-2 py-1 rounded border print:border-black print:text-black print:bg-transparent ${
                                                                    member.score >= 75 
                                                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                                                    : 'bg-red-100 text-red-700 border-red-200'
                                                                }`}>
                                                                    Nilai: {member.score}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-400 italic print:hidden">Belum dinilai</span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </li>
                                    );
                                })}
                            </ul>
                            ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 print:hidden">
                                <Users className="w-8 h-8 mb-2 opacity-20" />
                                <span className="text-sm italic opacity-60">Belum ada anggota</span>
                            </div>
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
                </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupList;