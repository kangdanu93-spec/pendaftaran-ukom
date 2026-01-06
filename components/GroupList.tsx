import React, { useEffect, useState } from 'react';
import { GroupRegistration } from '../types';
import { subscribeToRegistrations, deleteRegistration, clearAllRegistrations } from '../services/storageService';
import { Users, Trash2, Phone, School, LogOut, FileSpreadsheet, Database } from 'lucide-react';

interface GroupListProps {
  onLogout: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<GroupRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Berlangganan data realtime dari Firebase
    const unsubscribe = subscribeToRegistrations((data) => {
      setRegistrations(data);
      setIsLoading(false);
    });

    // Bersihkan langganan saat komponen ditutup
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus peserta ini dari Database?')) {
      try {
        await deleteRegistration(id);
      } catch (e) {
        alert("Gagal menghapus data. Cek koneksi internet.");
      }
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

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    // Header CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama Lengkap,Jenis Kelamin,Kelas,Kelompok,No WhatsApp,Waktu Daftar\n";

    // Data Rows
    registrations.forEach((row) => {
      const rowData = [
        `"${row.id}"`,
        `"${row.studentName}"`,
        `"${row.gender || '-'}"`,
        `"${row.className}"`,
        `"${row.teamName}"`,
        `"${row.whatsapp}"`,
        `"${row.createdAt}"`
      ].join(",");
      csvContent += rowData + "\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_ukom_online_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grouping logic
  const classes = ['12 MM1', '12 MM2'];
  const groupNumbers = [1, 2, 3, 4, 5, 6];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-10">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            Dashboard Data Online
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-sm text-gray-500">Terhubung ke Database Firebase ({registrations.length} siswa)</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end w-full md:w-auto">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              title="Download Data Excel/CSV"
            >
               <FileSpreadsheet className="w-4 h-4" /> Download Excel/CSV
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>

            <button 
              onClick={handleClearAll}
              className="px-3 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              title="Hapus Semua Data Database"
            >
               <Trash2 className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onLogout}
              className="ml-2 px-4 py-2.5 text-gray-700 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
               <LogOut className="w-4 h-4" /> Logout
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
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Data yang diinput siswa di HP mereka akan otomatis muncul di sini secara real-time.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {classes.map(className => (
            <div key={className} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-emerald-100">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <School className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Kelas {className}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupNumbers.map(num => {
                  const teamName = `Kelompok ${num}`;
                  const teamMembers = registrations.filter(r => r.className === className && r.teamName === teamName);
                  
                  // Logic: Kelompok 1-5 maks 6 orang, Kelompok 6 maks 7 orang
                  const limit = num === 6 ? 7 : 6;
                  
                  const isFull = teamMembers.length >= limit;
                  const isEmpty = teamMembers.length === 0;

                  return (
                    <div key={teamName} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isFull ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-200'}`}>
                      {/* Card Header */}
                      <div className={`px-5 py-4 border-b flex justify-between items-center ${
                        isFull ? 'bg-gradient-to-r from-orange-50 to-white' : 
                        isEmpty ? 'bg-gray-50' : 'bg-gradient-to-r from-emerald-50/50 to-white'
                      }`}>
                        <h3 className={`font-bold ${isFull ? 'text-orange-800' : 'text-gray-800'}`}>{teamName}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${
                          isFull ? 'bg-orange-100 text-orange-700' : 
                          isEmpty ? 'bg-gray-200 text-gray-500' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {teamMembers.length} / {limit}
                        </span>
                      </div>
                      
                      {/* Card Body */}
                      <div className="p-5 min-h-[160px]">
                        {teamMembers.length > 0 ? (
                          <ul className="space-y-3">
                            {teamMembers.map((member, idx) => (
                              <li key={member.id} className="flex justify-between items-start text-sm group">
                                <div className="flex items-start gap-3">
                                  <span className="text-gray-400 w-4 font-mono text-right flex-shrink-0 pt-0.5">{idx + 1}.</span>
                                  <div>
                                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                                        {member.studentName}
                                        {member.gender && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${member.gender === 'Laki-laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                {member.gender === 'Laki-laki' ? 'L' : 'P'}
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-[11px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit mt-0.5">
                                      <Phone className="w-3 h-3" /> {member.whatsapp}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDelete(member.id)}
                                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Hapus Siswa dari Database"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;