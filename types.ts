
export interface GroupRegistration {
  id: string;
  teamName: string; // e.g. "Kelompok 1"
  className: string; // "12 MM1"
  studentName: string; // Formerly leaderName, now the student's name
  gender: string; // "Laki-laki" | "Perempuan"
  whatsapp: string;
  createdAt: string;
  score?: number; // Optional score field (0-100)
}

export interface AdminUser {
  id: string;
  username: string;
  password: string; // In real app, this should be hashed. For school project, plain text is acceptable but handle with care.
  fullName: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export interface SystemSettings {
  isRegistrationOpen: boolean;
  announcement?: string;
}

export enum ViewState {
  HOME = 'HOME',
  FORM = 'FORM',
  LIST = 'LIST',
  CHECK_STATUS = 'CHECK_STATUS',
  PUBLIC_LIST = 'PUBLIC_LIST',
  WORKFLOW = 'WORKFLOW'
}