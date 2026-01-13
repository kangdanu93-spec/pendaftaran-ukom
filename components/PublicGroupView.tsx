import React, { useEffect, useState } from 'react';
import { GroupRegistration } from '../types';
import { subscribeToRegistrations } from '../services/storageService';
import { School, Loader2, Info } from 'lucide-react';

const PublicGroupView: React.FC = () => {
  const [registrations, setRegistrations] = useState<GroupRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeReg = subscribeToRegistrations((data) => {
      setRegistrations(data);
      setIsLoading(false);
    });
    return () => unsubscribeReg();
  }, []);

  const classes = ['12 MM1', '12 MM2', '12 TKR'];
  const groupNumbers = [1, 2, 3, 4, 5];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
         <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-10 px-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
            <Info className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Kelompok (Real-Time)</h2>
            <p className="text-gray-600 text-sm">Halaman ini diperbarui otomatis. Silakan cek ketersediaan slot sebelum mendaftar.</p>
        </div>
      </div>

      <div className="space-y-12">
        {classes.map(className => (
          <div key={className} className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-gray-100">
              <School className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800">Kelas {className}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupNumbers.map(num => {
                const teamName = `Kelompok ${num}`;
                const teamMembers = registrations.filter(r => r.className === className && r.teamName === teamName);
                // Groups 1-3 limit 5, Groups 4-5 limit 6
                const limit = num <= 3 ? 5 : 6;
                const isFull = teamMembers.length >= limit;
                
                return (
                  <div key={teamName} className={`bg-white rounded-xl shadow-sm border ${isFull ? 'border-orange-200 bg-orange-50/10' : 'border-gray-200'}`}>
                    {/* Header */}
                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                      <h3 className="font-bold text-gray-700">{teamName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {teamMembers.length}/{limit}
                      </span>
                    </div>

                    {/* Members List */}
                    <div className="p-4">
                        {teamMembers.length > 0 ? (
                             <ul className="space-y-2">
                                {teamMembers.map((m, idx) => (
                                    <li key={m.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-mono w-4">{idx + 1}.</span>
                                            <span className="text-gray-800 font-medium">{m.studentName}</span>
                                        </div>
                                        <span className={`text-[10px] px-1.5 rounded font-bold ${m.gender === 'Laki-laki' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'}`}>
                                            {m.gender === 'Laki-laki' ? 'L' : 'P'}
                                        </span>
                                    </li>
                                ))}
                             </ul>
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm italic">
                                Belum ada anggota
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
    </div>
  );
};

export default PublicGroupView;