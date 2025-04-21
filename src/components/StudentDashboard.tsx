
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Room } from "@/types";
import { Calendar, CheckCheck, X } from "lucide-react";

export function StudentDashboard() {
  const { user } = useAuth();
  const {
    getStudentRooms,
    getRoomByCode,
    joinRoom,
    markAttendance,
    getSubject,
    calculateAttendancePercentage,
    isLoading,
  } = useData();
  const { toast } = useToast();
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const studentRooms = user ? getStudentRooms(user.id) : [];
  const overallAttendance = user ? calculateAttendancePercentage(user.id) : 0;

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await joinRoom(roomCode);
      if (success) {
        const room = getRoomByCode(roomCode);
        if (room && user) {
          await markAttendance(room.id, user.id, "present");
          setRoomCode("");
          setIsJoinOpen(false);
          
          toast({
            title: "Success",
            description: "Attendance marked successfully",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid room code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studentRooms.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{overallAttendance}%</p>
              <Progress value={overallAttendance} className="h-2 flex-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-dart-blue hover:bg-dart-darkblue">
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Class & Mark Attendance</DialogTitle>
                  <DialogDescription>
                    Enter the room code provided by your teacher
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input
                      id="roomCode"
                      placeholder="e.g., ABC123"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinRoom} disabled={isLoading}>
                    {isLoading ? "Joining..." : "Join & Mark Present"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Classes</h3>
      </div>
      
      {studentRooms.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
          <p className="text-gray-500 mb-4">
            Join your first class to view your attendance
          </p>
          <Button
            className="bg-dart-blue hover:bg-dart-darkblue"
            onClick={() => setIsJoinOpen(true)}
          >
            Mark Your First Attendance
          </Button>
        </div>
      ) : (
        <Tabs
          defaultValue="classes"
          className="w-full"
          onValueChange={() => setSelectedRoom(null)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="classes">All Classes</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedRoom}>
              Attendance Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentRooms.map((room) => {
                const subject = getSubject(room.subject);
                const attendance = user ? calculateAttendancePercentage(user.id, room.id) : 0;
                
                return (
                  <Card key={room.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        Subject: {subject?.name || "Unknown"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Attendance:</span>
                          <span className={attendance >= 75 ? "text-green-600" : "text-red-600"}>
                            {attendance}%
                          </span>
                        </div>
                        <Progress value={attendance} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedRoom(room);
                          const element = document.querySelector('[data-value="details"]') as HTMLElement;
                          if (element) element.click();
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            {selectedRoom && user && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-dart-blue">
                    {selectedRoom.name} ({getSubject(selectedRoom.subject)?.name})
                  </h3>
                  <p className="text-gray-600">Room Code: {selectedRoom.roomCode}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Your Attendance</h4>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={calculateAttendancePercentage(user.id, selectedRoom.id)}
                        className="h-2 flex-1"
                      />
                      <span className="font-bold">
                        {calculateAttendancePercentage(user.id, selectedRoom.id)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold mb-4">Attendance History</h4>
                  <div className="space-y-2">
                    {/* Mock attendance history for demonstration */}
                    {Array.from({ length: 5 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      const isPresent = Math.random() > 0.3;
                      
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center p-2 border-b"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{date.toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isPresent ? "text-green-600" : "text-red-600"}`}>
                            {isPresent ? (
                              <>
                                <CheckCheck className="h-4 w-4" />
                                <span>Present</span>
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4" />
                                <span>Absent</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
