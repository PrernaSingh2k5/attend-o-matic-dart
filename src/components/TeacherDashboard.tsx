
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Room } from "@/types";
import { RoomAttendance } from "./teacher/RoomAttendance";
import { CreateRoomDialog } from "./teacher/CreateRoomDialog";

export function TeacherDashboard() {
  const { user } = useAuth();
  const { getTeacherRooms, subjects } = useData();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const teacherRooms = user ? getTeacherRooms(user.id) : [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Classrooms</h3>
        <CreateRoomDialog />
      </div>
      
      {teacherRooms.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">No Classrooms Yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first classroom to start tracking attendance
          </p>
          <CreateRoomDialog />
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
