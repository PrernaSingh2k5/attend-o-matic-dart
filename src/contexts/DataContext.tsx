import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Room, AttendanceRecord, Subject, User } from "@/types";
import { useAuth } from "./AuthContext";

interface DataContextType {
  rooms: Room[];
  attendanceRecords: AttendanceRecord[];
  subjects: Subject[];
  createRoom: (room: Omit<Room, "id" | "createdAt" | "roomCode">) => Promise<Room>;
  joinRoom: (roomCode: string) => Promise<boolean>;
  markAttendance: (roomId: string, studentId: string, status: "present" | "absent") => Promise<boolean>;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getRoomAttendance: (roomId: string) => AttendanceRecord[];
  getTeacherRooms: (teacherId: string) => Room[];
  getStudentRooms: (studentId: string) => Room[];
  getRoom: (roomId: string) => Room | undefined;
  getRoomByCode: (roomCode: string) => Room | undefined;
  getSubject: (subjectId: string) => Subject | undefined;
  getSubjectByName: (name: string) => Subject | undefined;
  calculateAttendancePercentage: (studentId: string, roomId?: string) => number;
  getStudentById: (studentId: string) => User | undefined;
  isLoading: boolean;
}

const SUBJECTS: Subject[] = [
  { id: "sub1", name: "Mathematics", code: "MATH101" },
  { id: "sub2", name: "Science", code: "SCI101" },
  { id: "sub3", name: "History", code: "HIST101" },
  { id: "sub4", name: "English", code: "ENG101" },
  { id: "sub5", name: "Computer Science", code: "CS101" },
];

const INITIAL_ROOMS: Room[] = [
  {
    id: "room1",
    name: "Mathematics Class",
    subject: "sub1",
    teacherId: "t1",
    createdAt: new Date().toISOString(),
    roomCode: "MATH123",
  },
  {
    id: "room2",
    name: "Science Lab",
    subject: "sub2",
    teacherId: "t1",
    createdAt: new Date().toISOString(),
    roomCode: "SCI456",
  },
  {
    id: "room3",
    name: "History Seminar",
    subject: "sub3",
    teacherId: "t2",
    createdAt: new Date().toISOString(),
    roomCode: "HIST789",
  },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    INITIAL_ROOMS.forEach(room => {
      records.push({
        id: `att-s1-${room.id}-${i}`,
        roomId: room.id,
        studentId: "s1",
        date: date.toISOString(),
        status: Math.random() > 0.2 ? "present" : "absent",
      });
      
      records.push({
        id: `att-s2-${room.id}-${i}`,
        roomId: room.id,
        studentId: "s2",
        date: date.toISOString(),
        status: Math.random() > 0.3 ? "present" : "absent",
      });
    });
  }
  
  return records;
};

const INITIAL_ATTENDANCE: AttendanceRecord[] = generateMockAttendance();

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, getUsers } = useAuth();
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [subjects] = useState<Subject[]>(SUBJECTS);
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async (
    roomData: Omit<Room, "id" | "createdAt" | "roomCode">
  ): Promise<Room> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const newRoom: Room = {
          id: `room${rooms.length + 1}`,
          ...roomData,
          createdAt: new Date().toISOString(),
          roomCode,
        };
        
        setRooms((prev) => [...prev, newRoom]);
        setIsLoading(false);
        resolve(newRoom);
      }, 500);
    });
  };

  const joinRoom = async (roomCode: string): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedRoomCode = roomCode.trim().toUpperCase();
        const room = rooms.find((r) => r.roomCode.toUpperCase() === normalizedRoomCode);
        setIsLoading(false);
        resolve(!!room);
      }, 500);
    });
  };

  const markAttendance = async (
    roomId: string,
    studentId: string,
    status: "present" | "absent"
  ): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split("T")[0];
        
        const existingRecord = attendanceRecords.find(
          (record) => 
            record.roomId === roomId && 
            record.studentId === studentId && 
            record.date.startsWith(today)
        );
        
        if (existingRecord) {
          setAttendanceRecords((prev) =>
            prev.map((record) =>
              record.id === existingRecord.id
                ? { ...record, status }
                : record
            )
          );
        } else {
          const newRecord: AttendanceRecord = {
            id: `att-${studentId}-${roomId}-${Date.now()}`,
            roomId,
            studentId,
            date: new Date().toISOString(),
            status,
          };
          
          setAttendanceRecords((prev) => [...prev, newRecord]);
        }
        
        setIsLoading(false);
        resolve(true);
      }, 500);
    });
  };

  const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
    return attendanceRecords.filter((record) => record.studentId === studentId);
  };

  const getRoomAttendance = (roomId: string): AttendanceRecord[] => {
    return attendanceRecords.filter((record) => record.roomId === roomId);
  };

  const getTeacherRooms = (teacherId: string): Room[] => {
    return rooms.filter((room) => room.teacherId === teacherId);
  };

  const getStudentRooms = (studentId: string): Room[] => {
    const roomIds = new Set(
      attendanceRecords
        .filter((record) => record.studentId === studentId)
        .map((record) => record.roomId)
    );
    
    return rooms.filter((room) => roomIds.has(room.id));
  };

  const getRoom = (roomId: string): Room | undefined => {
    return rooms.find((room) => room.id === roomId);
  };

  const getRoomByCode = (roomCode: string): Room | undefined => {
    const normalizedRoomCode = roomCode.trim().toUpperCase();
    return rooms.find((room) => room.roomCode.toUpperCase() === normalizedRoomCode);
  };

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((subject) => subject.id === subjectId);
  };

  const getSubjectByName = (name: string): Subject | undefined => {
    return subjects.find((subject) => subject.name.toLowerCase() === name.toLowerCase());
  };

  const calculateAttendancePercentage = (studentId: string, roomId?: string): number => {
    let records = attendanceRecords.filter((record) => record.studentId === studentId);
    
    if (roomId) {
      records = records.filter((record) => record.roomId === roomId);
    }
    
    if (records.length === 0) return 0;
    
    const presentCount = records.filter((record) => record.status === "present").length;
    return Math.round((presentCount / records.length) * 100);
  };

  const getStudentById = (studentId: string): User | undefined => {
    const users = getUsers();
    return users.find(user => user.id === studentId && user.role === 'student');
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        attendanceRecords,
        subjects,
        createRoom,
        joinRoom,
        markAttendance,
        getStudentAttendance,
        getRoomAttendance,
        getTeacherRooms,
        getStudentRooms,
        getRoom,
        getRoomByCode,
        getSubject,
        getSubjectByName,
        calculateAttendancePercentage,
        getStudentById,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
