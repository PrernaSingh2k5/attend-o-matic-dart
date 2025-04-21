
import { Calendar, Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dart-blue text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-2">
                <span className="text-dart-blue font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl">Attend-O-Matic Dart</span>
            </div>
            <p className="text-sm text-gray-200 mt-1">Simplifying attendance tracking for schools and colleges</p>
          </div>
          
          <div className="flex space-x-10">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Features
              </h3>
              <ul className="text-sm text-gray-200 space-y-1">
                <li>Real-time attendance tracking</li>
                <li>Subject-wise analytics</li>
                <li>Secure room management</li>
                <li>Attendance reporting</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                User Roles
              </h3>
              <ul className="text-sm text-gray-200 space-y-1">
                <li>Teacher dashboard</li>
                <li>Student portal</li>
                <li>Room creation</li>
                <li>Attendance marking</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-700 text-center text-sm text-gray-200">
          <p>© {new Date().getFullYear()} Attend-O-Matic Dart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
