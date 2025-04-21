
import { Room, AttendanceRecord } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";

interface RoomStatsProps {
  room: Room;
  subject: { name: string } | undefined;
  attendanceRecords: AttendanceRecord[];
  uniqueStudentCount: number;
  sessionCount: number;
}

export function RoomStats({ 
  room, 
  subject, 
  attendanceRecords, 
  uniqueStudentCount, 
  sessionCount 
}: RoomStatsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-dart-blue">
        {room.name} ({subject?.name})
      </h3>
      <p className="text-gray-600">Room Code: {room.roomCode}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Date(room.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueStudentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sessionCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
