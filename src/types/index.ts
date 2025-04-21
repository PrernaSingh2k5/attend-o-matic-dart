
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Room {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  createdAt: string;
  roomCode: string;
}

export interface AttendanceRecord {
  id: string;
  roomId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}
