import { db } from './firebaseConfig';
import { ref, push, onValue, remove, get, child } from "firebase/database";
import { GroupRegistration } from '../types';

const DB_PATH = 'registrations';

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
// Callback akan dipanggil setiap ada data baru masuk/dihapus
export const subscribeToRegistrations = (callback: (data: GroupRegistration[]) => void) => {
  const registrationsRef = ref(db, DB_PATH);
  
  return onValue(registrationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const parsedData = Object.keys(data).map(key => ({
        ...data[key],
        id: key // Gunakan key dari firebase sebagai ID
      }));
      // Urutkan berdasarkan waktu (terbaru di atas)
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
  // Hapus ID manual karena Firebase akan membuatkan ID unik
  const { id, ...dataToSave } = registration;
  const registrationsRef = ref(db, DB_PATH);
  await push(registrationsRef, dataToSave);
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const itemRef = ref(db, `${DB_PATH}/${id}`);
  await remove(itemRef);
};

export const clearAllRegistrations = async (): Promise<void> => {
  const registrationsRef = ref(db, DB_PATH);
  await remove(registrationsRef);
};

// Helper untuk validasi (harus async karena fetch ke server)
export const checkGroupAvailability = async (className: string, teamName: string): Promise<{
  count: number,
  isFull: boolean
}> => {
  const allData = await getRegistrationsOnce();
  const count = allData.filter(
    (reg) => reg.className === className && reg.teamName === teamName
  ).length;
  
  return {
    count,
    isFull: count >= 7
  };
};