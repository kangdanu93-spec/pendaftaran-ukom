import React, { useEffect, useState } from 'react';
import { GroupRegistration, AdminUser, SystemSettings } from '../types';
import { subscribeToRegistrations, deleteRegistration, updateRegistration, subscribeToSettings, updateSystemSettings } from '../services/storageService';
import { Users, Trash2, Phone, School, LogOut, FileSpreadsheet, Database, Shield, GraduationCap, Check, Lock, Unlock, Search, X, Edit, PieChart, BarChart3, Save, Printer } from 'lucide-react';
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

  // State untuk Modal Hapus & Edit
  const [studentToDelete, setStudentToDelete] = useState<GroupRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [studentToEdit, setStudentToEdit] = useState<GroupRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form State untuk Edit
  const [editForm, setEditForm] = useState({
    studentName: '',
    whatsapp: '',
    gender: '',
    className: '',
    teamName: ''
  });

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

  // --- DELETE LOGIC ---
  const initiateDelete = (student: GroupRegistration) => {
    setStudentToDelete(student);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteRegistration(studentToDelete.id);
      setStudentToDelete(null); 
    } catch (e) {
      alert("Gagal menghapus data. Cek koneksi internet.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- EDIT LOGIC ---
  const initiateEdit = (student: GroupRegistration) => {
    setStudentToEdit(student);
    setEditForm({
        studentName: student.studentName,
        whatsapp: student.whatsapp,
        gender: student.gender,
        className: student.className,
        teamName: student.teamName
    });
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit) return;

    setIsUpdating(true);
    try {
        await updateRegistration(studentToEdit.id, {
            studentName: editForm.studentName.toUpperCase(),
            whatsapp: editForm.whatsapp,
            gender: editForm.gender,
            className: editForm.className,
            teamName: editForm.teamName
        });
        setStudentToEdit(null);
    } catch (error) {
        console.error(error);
        alert("Gagal mengupdate data.");
    } finally {
        setIsUpdating(false);
    }
  };

  // --- SETTINGS LOGIC ---
  const toggleRegistrationStatus = async () => {
    try {
      await updateSystemSettings({ isRegistrationOpen: !settings.isRegistrationOpen });
    } catch (e) {
      alert("Gagal mengubah status pendaftaran.");
    }
  };

  // --- GRADING LOGIC ---
  const handleScoreChange = (id: string, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (parseInt(value) > 100) return;
    
    setTempScores(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveScore = async (id: string) => {
    const val = tempScores[id];
    if (val === undefined || val === '') return;

    setSavingScoreId(id);
    try {
        await updateRegistration(id, { score: parseInt(val) });
        setTempScores(prev => {
            const next = {...prev};
            delete next[id];
            return next;
        });
    } catch (e) {
        alert("Gagal menyimpan nilai");
    } finally {
        setSavingScoreId(null);
    }
  };

  // --- EXPORT & PRINT LOGIC ---
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama Lengkap,Jenis Kelamin,Kelas,Kelompok,No WhatsApp,Nilai UKOM,Status Kelulusan,Waktu Daftar\n";
    registrations.forEach((row) => {
      const isLulus = (row.score || 0) >= 75 ? 'LULUS' : 'TIDAK LULUS';
      const rowData = [
        `"${row.id}"`, `"${row.studentName}"`, `"${row.gender || '-'}"`, `"${row.className}"`, `"${row.teamName}"`, `"${row.whatsapp}"`,
        `"${row.score !== undefined ? row.score : 'Belum Dinilai'}"`, `"${row.score !== undefined ? isLulus : '-'}"`, `"${row.createdAt}"`
      ].join(",");
      csvContent += rowData + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_ukom_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Grouping & Filtering Logic
  const classes = ['12 MM1', '12 MM2'];
  const groupNumbers = [1, 2, 3, 4, 5, 6];

  const filteredRegistrations = searchTerm 
    ? registrations.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.teamName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : registrations;

  // --- STATISTICS CALCULATION ---
  const stats = {
      total: registrations.length,
      male: registrations.filter(r => r.gender === 'Laki-laki').length,
      female: registrations.filter(r => r.gender === 'Perempuan').length,
      rated: registrations.filter(r => r.score !== undefined).length,
      passed: registrations.filter(r => (r.score || 0) >= 75).length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up pb-10">
      
      {/* --- KOP SURAT (Hanya Muncul Saat Print) --- */}
      <div className="hidden print:flex items-center justify-between mb-8 border-b-4 border-double border-emerald-900 pb-4 px-2">
         {/* Logo Kiri (Sekolah) */}
         <div className="w-24 h-24 flex items-center justify-center">
             <img 
               src="https://i.ibb.co.com/0f6WdZ6/logo-sma.jpg" 
               alt="Logo Sekolah" 
               className="w-full h-full object-contain"
             />
         </div>

         {/* Teks Tengah */}
         <div className="flex-1 text-center px-4">
             <h3 className="text-lg font-bold text-gray-600 tracking-wider mb-1">YAYASAN PENDIDIKAN ISLAM</h3>
             <h1 className="text-3xl font-black text-emerald-900 tracking-tighter leading-none mb-1">SMK MATHLA'UL ANWAR</h1>
             <h2 className="text-2xl font-bold text-red-600 tracking-widest leading-none mb-2">BUARANJATI</h2>
             <p className="text-xs text-black font-medium leading-tight max-w-md mx-auto">
               Jl. Raya Mauk Km. 13, Buaran Jati, Kec. Sukadiri, Kab. Tangerang, Banten 15530
             </p>
             <div className="mt-3 bg-emerald-900 text-white text-xs font-bold px-6 py-1 inline-block rounded-sm uppercase tracking-wide">
               Laporan Kelompok UKOM 2026
             </div>
         </div>

         {/* Logo Kanan (Jurusan) */}
         <div className="w-24 h-24 flex items-center justify-center">
            <img 
               src="https://i.ibb.co.com/84jKXm7/Desain-Komunikasi-Visual-1.png" 
               alt="Logo Jurusan" 
               className="w-full h-full object-contain"
             />
         </div>
      </div>

      {/* Modal User Management */}
      {showUserManagement && <UserManagement onClose={() => setShowUserManagement(false)} />}

      {/* MODAL EDIT SISWA */}
      {studentToEdit && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in print:hidden">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-emerald-600" /> Edit Data Siswa
                    </h3>
                    <button onClick={() => setStudentToEdit(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                </div>
                
                <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={editForm.studentName}
                            onChange={(e) => setEditForm({...editForm, studentName: e.target.value.toUpperCase()})}
                            className="w-full border rounded-lg px-3 py-2 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kelas</label>
                            <select 
                                value={editForm.className}
                                onChange={(e) => setEditForm({...editForm, className: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 bg-white"
                            >
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Jenis Kelamin</label>
                            <select 
                                value={editForm.gender}
                                onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 bg-white"
                            >
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kelompok</label>
                            <select 
                                value={editForm.teamName}
                                onChange={(e) => setEditForm({...editForm, teamName: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2 bg-white"
                            >
                                {groupNumbers.map(n => <option key={n} value={`Kelompok ${n}`}>Kelompok {n}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">WhatsApp</label>
                            <input 
                                type="text" 
                                value={editForm.whatsapp}
                                onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStudentToEdit(null)} className="flex-1 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 font-bold">Batal</button>
                        <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold flex justify-center items-center gap-2">
                             {isUpdating ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in print:hidden">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up border border-gray-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Siswa?</h3>
                    <div className="bg-gray-50 rounded-lg p-3 w-full mb-4 border border-gray-100">
                        <p className="font-bold text-gray-800 text-lg">{studentToDelete.studentName}</p>
                        <p className="text-sm text-gray-500">{studentToDelete.className} • {studentToDelete.teamName}</p>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">Tindakan ini tidak bisa dibatalkan.</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={() => setStudentToDelete(null)} disabled={isDeleting} className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold">Batal</button>
                        <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Header Admin (Disembunyikan saat Print) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:hidden">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-600" />
              Dashboard Admin
            </h2>
            {currentUser.role === 'superadmin' && (
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-200">SUPER</span>
            )}
           </div>
          <p className="text-sm text-gray-500 mt-1">Kelola data pendaftaran dan nilai siswa.</p>
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

            <button onClick={toggleRegistrationStatus} className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${settings.isRegistrationOpen ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {settings.isRegistrationOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            <button onClick={() => setIsGradingMode(!isGradingMode)} className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${isGradingMode ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-200' : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400'}`} title="Input Nilai">
                <GraduationCap className="w-4 h-4" /> 
            </button>

            {currentUser.role === 'superadmin' && (
              <button onClick={() => setShowUserManagement(true)} className="px-3 py-2.5 text-gray-700 bg-white border border-gray-200 hover:border-emerald-500 rounded-xl" title="Kelola Admin">
                 <Shield className="w-4 h-4" />
              </button>
            )}

            <button onClick={handlePrint} className="px-3 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl flex items-center gap-2 font-bold transition-all" title="Cetak Laporan">
                <Printer className="w-4 h-4" /> <span className="hidden md:inline">Cetak</span>
            </button>

            <button onClick={handleExportCSV} className="px-3 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl" title="Download Excel"><FileSpreadsheet className="w-4 h-4" /></button>
            
            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>
            
            <button onClick={onLogout} className="px-3 py-2.5 text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS (Sembunyikan saat Print) */}
      {!isLoading && registrations.length > 0 && !searchTerm && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-lg"><Users className="w-6 h-6 text-emerald-600" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Total Siswa</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg"><PieChart className="w-6 h-6 text-blue-600" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Laki / Per</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.male} <span className="text-sm text-gray-400 font-normal">/ {stats.female}</span></p>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg"><BarChart3 className="w-6 h-6 text-purple-600" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Sudah Dinilai</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.rated} <span className="text-sm text-gray-400 font-normal">/ {stats.total}</span></p>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg"><Check className="w-6 h-6 text-green-600" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Lulus (≥75)</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.passed}</p>
                </div>
            </div>
        </div>
      )}

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
          {/* JIKA SEDANG SEARCHING */}
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
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => initiateEdit(reg)} className="text-amber-600 hover:underline">Edit</button>
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
                <div key={className} className="animate-fade-in break-inside-avoid print:break-before-auto">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-emerald-100 print:border-emerald-600 print:mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg print:hidden"><School className="w-6 h-6 text-emerald-700" /></div>
                    <h2 className="text-2xl font-bold text-gray-800 print:text-emerald-800 print:text-xl">Kelas {className}</h2>
                </div>
                
                {/* 
                   GRID LAYOUT KHUSUS PRINT:
                   print:grid-cols-2 -> Membagi jadi 2 kolom di A4
                   print:gap-4 -> Mengurangi jarak antar kartu agar muat
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4 print:block print:columns-2">
                    {groupNumbers.map(num => {
                    const teamName = `Kelompok ${num}`;
                    const teamMembers = registrations.filter(r => r.className === className && r.teamName === teamName);
                    const limit = num === 6 ? 7 : 6;
                    const isFull = teamMembers.length >= limit;
                    const isEmpty = teamMembers.length === 0;

                    // Jangan print kelompok kosong
                    if (isEmpty) return (
                         <div key={teamName} className="hidden print:hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400">
                             <span className="text-sm italic opacity-60">Belum ada anggota</span>
                        </div>
                    );

                    return (
                        <div key={teamName} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 break-inside-avoid page-break-inside-avoid mb-6 print:mb-4 print:shadow-none print:border-2 ${isFull ? 'border-orange-200 print:border-orange-300' : 'border-gray-200 print:border-emerald-200'}`}>
                        {/* Card Header Berwarna */}
                        <div className={`px-5 py-4 border-b flex justify-between items-center print:py-2 ${isFull ? 'bg-gradient-to-r from-orange-50 to-white print:bg-orange-100 print:from-orange-100' : 'bg-gradient-to-r from-emerald-50/50 to-white print:bg-emerald-100 print:from-emerald-100'}`}>
                            <h3 className={`font-bold ${isFull ? 'text-orange-800' : 'text-gray-800'} print:text-black print:text-base`}>{teamName}</h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm print:border print:border-black/10 ${isFull ? 'bg-orange-100 text-orange-700 print:bg-white' : 'bg-emerald-100 text-emerald-700 print:bg-white'}`}>
                            {teamMembers.length} / {limit}
                            </span>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-5 min-h-[160px] print:min-h-0 print:p-3">
                            {teamMembers.length > 0 ? (
                            <ul className="space-y-4 print:space-y-1">
                                {teamMembers.map((member, idx) => {
                                    const isSaving = savingScoreId === member.id;
                                    const currentInputValue = tempScores[member.id] !== undefined ? tempScores[member.id] : (member.score?.toString() || '');
                                    
                                    return (
                                    <li key={member.id} className="flex flex-col gap-1 text-sm group border-b border-gray-50 pb-2 last:border-0 last:pb-0 print:border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3 w-full">
                                            <span className="text-gray-400 w-4 font-mono text-right flex-shrink-0 pt-0.5 print:text-black/60">{idx + 1}.</span>
                                            <div className="w-full">
                                                <div className="flex justify-between w-full">
                                                    <span className="font-semibold text-gray-700 flex items-center gap-2 print:text-black">
                                                        {member.studentName}
                                                        {/* Gender Badge Color di Print */}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold print:border print:border-gray-200 ${member.gender === 'Laki-laki' ? 'bg-blue-100 text-blue-700 print:bg-blue-50' : 'bg-pink-100 text-pink-700 print:bg-pink-50'}`}>{member.gender === 'Laki-laki' ? 'L' : 'P'}</span>
                                                    </span>
                                                    
                                                    {/* TOMBOL ACTION - HIDE ON PRINT */}
                                                    {!isGradingMode && (
                                                        <div className="flex gap-1 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => initiateEdit(member)} className="text-gray-400 hover:text-amber-500 hover:bg-amber-50 p-1 rounded" title="Edit Data"><Edit className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => initiateDelete(member)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded" title="Hapus Siswa"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex justify-between items-end mt-1">
                                                    <span className="text-[11px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit print:hidden">
                                                        <Phone className="w-3 h-3" /> {member.whatsapp}
                                                    </span>

                                                    {/* SCORE DISPLAY / INPUT */}
                                                    <div className="flex items-center">
                                                        {isGradingMode ? (
                                                            <div className="flex items-center