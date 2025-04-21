
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Room, AttendanceRecord } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Users } from "lucide-react";

// Component to show attendance details in a room
const RoomAttendance = ({ room }: { room: Room }) => {
  const { getRoomAttendance, getSubject } = useData();
  const { getUsers } = useAuth();
  const subject = getSubject(room.subject);
  const attendanceRecords = getRoomAttendance(room.id);
  
  // Get all students
  const students = getUsers().filter(user => user.role === 'student');
  
  // Group attendance by date
  const groupedByDate = attendanceRecords.reduce((acc, record) => {
    const date = record.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Stats cards section
  return (
    <div className="space-y-4">
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
              <p className="text-2xl font-bold">
                {new Set(attendanceRecords.map(r => r.studentId)).size}
              </p>
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
              <p className="text-2xl font-bold">{sortedDates.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => {
                      const record = groupedByDate[date].find(r => r.studentId === student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell 
                            className={
                              record ? 
                                record.status === 'present' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                              : 'text-gray-400'
                            }
                          >
                            {record ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Not Marked'}
                          </TableCell>
                          <TableCell>
                            {record ? new Date(record.date).toLocaleTimeString() : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
};

export function TeacherDashboard() {
  const { user } = useAuth();
  const { getTeacherRooms, createRoom, subjects, isLoading } = useData();
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomSubject, setNewRoomSubject] = useState("");

  const teacherRooms = user ? getTeacherRooms(user.id) : [];

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !newRoomSubject) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRoom({
        name: newRoomName,
        subject: newRoomSubject,
        teacherId: user?.id || "",
      });
      
      setNewRoomName("");
      setNewRoomSubject("");
      setIsCreateOpen(false);
      
      toast({
        title: "Success",
        description: "Room created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Classrooms</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dart-blue hover:bg-dart-darkblue">
              Create New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Classroom</DialogTitle>
              <DialogDescription>
                Set up a new room for taking attendance
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  placeholder="e.g., Morning Algebra Class"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newRoomSubject}
                  onChange={(e) => setNewRoomSubject(e.target.value)}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoom} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {teacherRooms.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">No Classrooms Yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first classroom to start tracking attendance
          </p>
          <Button
            className="bg-dart-blue hover:bg-dart-darkblue"
            onClick={() => setIsCreateOpen(true)}
          >
            Create Your First Room
          </Button>
        </div>
      ) : (
        <Tabs
          defaultValue="rooms"
          className="w-full"
          onValueChange={() => setSelectedRoom(null)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="rooms">Your Rooms</TabsTrigger>
            <TabsTrigger value="attendance" disabled={!selectedRoom}>
              Attendance Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherRooms.map((room) => {
                const subject = subjects.find(s => s.id === room.subject);
                return (
                  <Card key={room.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        Subject: {subject?.name || "Unknown"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Room Code:</strong> {room.roomCode}</p>
                      <p><strong>Created:</strong> {new Date(room.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedRoom(room);
                          const element = document.querySelector('[data-value="attendance"]') as HTMLElement;
                          if (element) element.click();
                        }}
                      >
                        View Attendance
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            {selectedRoom && <RoomAttendance room={selectedRoom} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
