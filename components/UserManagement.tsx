import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { addAdminUser, subscribeToAdmins, deleteAdminUser, updateAdminUser } from '../services/storageService';
import { UserPlus, Trash2, Shield, X, Save, UserCheck, KeyRound, Loader2, Edit2, RotateCcw } from 'lucide-react';

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAdmins((data) => {
      setAdmins(data);
    });
    return () => unsubscribe();
  }, []);

  const handleStartEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setFullName(user.fullName);
    setRole(user.role);
    // Scroll to form
    const formElement = document.getElementById('user-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setUsername('');
    setPassword('');
    setFullName('');
    setRole('admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !fullName) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        // UPDATE MODE
        await updateAdminUser(editingId, {
          username,
          password,
          fullName,
          role
        });
        alert("Data user berhasil diperbarui.");
        handleCancelEdit(); // Reset form
      } else {
        // CREATE MODE
        // Simple check duplicate
        if (admins.some(a => a.username === username)) {
          alert("Username sudah digunakan!");
          setIsSubmitting(false);
          return;
        }

        await addAdminUser({
          username,
          password,
          fullName,
          role,
          createdAt: new Date().toISOString()
        });
        
        // Reset form
        setUsername('');
        setPassword('');
        setFullName('');
        setRole('admin');
        alert("Berhasil menambah user baru.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data. Cek koneksi internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmDeleteId === id) {
      setDeletingId(id);
      setConfirmDeleteId(null);
      
      try {
        await deleteAdminUser(id);
        // If we deleted the user currently being edited, cancel edit mode
        if (editingId === id) {
            handleCancelEdit();
        }
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus. Cek koneksi atau izin.");
      } finally {
        setDeletingId(null);
      }
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => {
        setConfirmDeleteId(prev => prev === id ? null : prev);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Manajemen User Admin
          </h2>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Note for Default Admin */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-800">
             <p className="font-bold mb-1">Catatan Penting:</p>
             <p>Akun default (admin) tidak bisa diedit/dihapus. Untuk keamanan, buat akun Super Admin baru di bawah ini, lalu gunakan akun tersebut untuk login selanjutnya.</p>
          </div>

          {/* Form */}
          <div id="user-form" className={`border rounded-xl p-5 transition-all duration-300 ${editingId ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-100' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${editingId ? 'text-amber-700' : 'text-gray-800'}`}>
              {editingId ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5 text-emerald-600" />} 
              {editingId ? 'Edit Data Admin & Password' : 'Tambah Admin Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Guru / Admin</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: Pak Budi"
                  required
                />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Username Login</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password Login</label>
                <input 
                  type="text" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Password"
                  required
                />
              </div>
              
              {/* Role Selection */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Level Akses</label>
                <div className="flex gap-4">
                   <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 bg-white transition-all ${role === 'admin' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="admin" 
                        checked={role === 'admin'} 
                        onChange={() => setRole('admin')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="block font-bold text-sm">Admin Biasa</span>
                        <span className="block text-xs text-gray-500">Hanya kelola data siswa</span>
                      </div>
                   </label>
                   <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 bg-white transition-all ${role === 'superadmin' ? 'border-purple-500 bg-purple-50 text-purple-700' : ''}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="superadmin" 
                        checked={role === 'superadmin'} 
                        onChange={() => setRole('superadmin')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                         <span className="block font-bold text-sm">Super Admin</span>
                         <span className="block text-xs text-gray-500">Full akses + kelola admin lain</span>
                      </div>
                   </label>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                {editingId && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Batal
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> {editingId ? 'Update Data' : 'Simpan User'}</>}
                </button>
              </div>
            </form>
          </div>

          {/* List Users */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> Daftar Admin Aktif
            </h3>
            
            {admins.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl text-gray-400">
                <p>Belum ada user tambahan. Gunakan akun default Super Admin (admin / admin123).</p>
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map(user => {
                  const isConfirming = confirmDeleteId === user.id;
                  const isDeleting = deletingId === user.id;
                  const isEditing = editingId === user.id;

                  return (
                    <div key={user.id} className={`flex items-center justify-between p-4 border shadow-sm rounded-xl transition-all ${isEditing ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 hover:shadow-md'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.role === 'superadmin' ? 'bg-purple-600' : 'bg-emerald-600'}`}>
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800">{user.fullName}</p>
                            {user.role === 'superadmin' && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-bold">SUPER</span>}
                            {isEditing && <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">SEDANG DIEDIT</span>}
                          </div>
                          <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isConfirming && (
                           <div className="hidden sm:flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1.5 rounded border mr-2">
                              <KeyRound className="w-3 h-3" /> {user.password}
                           </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleStartEdit(user)}
                          disabled={isDeleting || isEditing}
                          className="text-gray-400 hover:text-amber-600 p-2 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-30"
                          title="Edit Password / Data"
                        >
                           <Edit2 className="w-5 h-5" />
                        </button>

                        <button 
                          type="button"
                          onClick={(e) => handleDeleteClick(user.id, e)}
                          disabled={isDeleting}
                          className={`transition-all duration-300 rounded-lg flex items-center justify-center gap-1.5 font-bold text-sm ${
                            isConfirming 
                              ? 'bg-red-600 text-white px-4 py-1.5 hover:bg-red-700 shadow-sm' 
                              : 'text-gray-400 hover:text-red-600 p-2 hover:bg-red-50'
                          } disabled:opacity-50 disabled:cursor-wait`}
                          title={isConfirming ? "Klik lagi untuk menghapus" : "Hapus User"}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                          ) : isConfirming ? (
                            <>Hapus?</>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t text-right">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;