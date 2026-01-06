import { db } from './firebaseConfig';
import { ref, push, onValue, remove, get, child, update } from "firebase/database";
import { GroupRegistration, AdminUser, SystemSettings } from '../types';

const DB_PATH = 'registrations';
const ADMIN_PATH = 'admins';
const SETTINGS_PATH = 'settings';

// --- EXISTING REGISTRATION FUNCTIONS ---

// Mendapatkan data sekali jalan (Promise based)
export const getRegistrationsOnce = async (): Promise<GroupRegistration[]> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, DB_PATH));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Konversi Object Firebase ke Array
      return Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Berlangganan perubahan data (Realtime)
export const subscribeToRegistrations = (callback: (data: GroupRegistration[]) => void) => {
  const registrationsRef = ref(db, DB_PATH);
  
  return onValue(registrationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const parsedData = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
      const sorted = parsedData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(sorted);
    } else {
      callback([]);
    }
  });
};

export const saveRegistration = async (registration: GroupRegistration): Promise<void> => {
  const { id, ...dataToSave } = registration;
  const registrationsRef = ref(db, DB_PATH);
  await push(registrationsRef, dataToSave);
};

// Fungsi baru untuk update sebagian data (misal: nilai)
export const updateRegistration = async (id: string, updates: Partial<GroupRegistration>): Promise<void> => {
  const itemRef = ref(db, `${DB_PATH}/${id}`);
  await update(itemRef, updates);
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const itemRef = ref(db, `${DB_PATH}/${id}`);
  await remove(itemRef);
};

export const clearAllRegistrations = async (): Promise<void> => {
  const registrationsRef = ref(db, DB_PATH);
  await remove(registrationsRef);
};

export const checkGroupAvailability = async (className: string, teamName: string): Promise<{
  count: number,
  isFull: boolean
}> => {
  const allData = await getRegistrationsOnce();
  const count = allData.filter(
    (reg) => reg.className === className && reg.teamName === teamName
  ).length;
  
  const match = teamName.match(/Kelompok (\d+)/);
  const groupNum = match ? parseInt(match[1]) : 0;
  
  const limit = groupNum === 6 ? 7 : 6;

  return {
    count,
    isFull: count >= limit
  };
};

export const checkDuplicateStudent = async (studentName: string, className: string): Promise<boolean> => {
  const allData = await getRegistrationsOnce();
  // Cek apakah ada nama yang SAMA PERSIS (case insensitive) di KELAS yang sama
  const exists = allData.some(
    (reg) => 
      reg.studentName.toLowerCase().trim() === studentName.toLowerCase().trim() && 
      reg.className === className
  );
  return exists;
};

// --- NEW ADMIN MANAGEMENT FUNCTIONS ---

export const authenticateUser = async (username: string, password: string): Promise<{ success: boolean; user?: AdminUser }> => {
  // Hardcoded Fallback - THIS IS THE SUPER ADMIN
  if (username === 'admin' && password === 'admin123') {
     return { 
       success: true, 
       user: { 
         id: 'master', 
         username: 'admin', 
         password: '', 
         fullName: 'Master Super Admin', 
         role: 'superadmin', 
         createdAt: new Date().toISOString() 
       } 
     };
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, ADMIN_PATH));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const users: AdminUser[] = Object.keys(data).map(key => ({ ...data[key], id: key }));
      
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        return { success: true, user: foundUser };
      }
    }
  } catch (error) {
    console.error("Auth error:", error);
  }

  return { success: false };
};

export const addAdminUser = async (user: Omit<AdminUser, 'id'>): Promise<void> => {
  const adminsRef = ref(db, ADMIN_PATH);
  await push(adminsRef, user);
};

export const updateAdminUser = async (id: string, user: Partial<AdminUser>): Promise<void> => {
  const itemRef = ref(db, `${ADMIN_PATH}/${id}`);
  const { id: _, ...updates } = user;
  await update(itemRef, updates);
};

export const subscribeToAdmins = (callback: (data: AdminUser[]) => void) => {
  const adminsRef = ref(db, ADMIN_PATH);
  return onValue(adminsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const parsedData = Object.keys(data).map(key => ({ ...data[key], id: key }));
      callback(parsedData);
    } else {
      callback([]);
    }
  });
};

export const deleteAdminUser = async (id: string): Promise<void> => {
  const itemRef = ref(db, `${ADMIN_PATH}/${id}`);
  await remove(itemRef);
};

// --- SYSTEM SETTINGS FUNCTIONS ---

export const subscribeToSettings = (callback: (data: SystemSettings) => void) => {
  const settingsRef = ref(db, SETTINGS_PATH);
  return onValue(settingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      // Default settings if not exists
      callback({ isRegistrationOpen: true });
    }
  });
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<void> => {
  const settingsRef = ref(db, SETTINGS_PATH);
  await update(settingsRef, settings);
};