export interface GroupRegistration {
  id: string;
  teamName: string; // e.g. "Kelompok 1"
  className: string; // "12 MM1"
  studentName: string; // Formerly leaderName, now the student's name
  gender: string; // "Laki-laki" | "Perempuan"
  whatsapp: string;
  createdAt: string;
}

export enum ViewState {
  HOME = 'HOME',
  FORM = 'FORM',
  LIST = 'LIST',
  GUIDE = 'GUIDE'
}