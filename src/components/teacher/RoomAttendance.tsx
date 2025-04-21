
import { Room, AttendanceRecord } from "@/types";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RoomStats } from "./RoomStats";
import { AttendanceTable } from "./AttendanceTable";

export function RoomAttendance({ room }: { room: Room }) {
  const { getRoomAttendance, getSubject } = useData();
  const { getUsers } = useAuth();
  const subject = getSubject(room.subject);
  const attendanceRecords = getRoomAttendance(room.id);
  
  const students = getUsers().filter(user => user.role === 'student');
  
  const groupedByDate = attendanceRecords.reduce((acc, record) => {
    const date = record.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
  
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const uniqueStudentCount = new Set(attendanceRecords.map(r => r.studentId)).size;

  return (
    <div className="space-y-4">
      <RoomStats 
        room={room}
        subject={subject}
        attendanceRecords={attendanceRecords}
        uniqueStudentCount={uniqueStudentCount}
        sessionCount={sortedDates.length}
      />
      
      {sortedDates.length > 0 ? (
        <div className="space-y-4">
          {sortedDates.map(date => (
            <Card key={date}>
              <CardHeader>
                <CardTitle>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
                <CardDescription>
                  Attendance Summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable 
                  students={students}
                  records={groupedByDate[date]}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No attendance records yet for this room.</p>
        </div>
      )}
    </div>
  );
}
