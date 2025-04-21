
import { AuthForm } from "@/components/AuthForm";
import { Layout } from "@/components/Layout";

const Login = () => {
  return (
    <Layout hideFooter>
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side with image/info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-dart-blue via-dart-purple to-dart-darkblue p-8 flex-col justify-center items-center text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-3">
                <span className="text-dart-blue font-bold text-2xl">A</span>
              </div>
              <h1 className="text-3xl font-bold">Attend-O-Matic Dart</h1>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Modern Attendance Tracking</h2>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">For Teachers</h3>
                <p>Create virtual rooms for your classes and easily track student attendance in real-time.</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">For Students</h3>
                <p>Mark your attendance with a simple room code and track your attendance records across all subjects.</p>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-blue-100">
              <p>Demo credentials:</p>
              <p>Teacher: teacher@example.com / password123</p>
              <p>Student: student@example.com / password123</p>
            </div>
          </div>
        </div>
        
        {/* Right side with auth form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 text-center">
              <div className="inline-flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-dart-blue flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold text-dart-blue">Attend-O-Matic Dart</h1>
              </div>
              <p className="text-gray-600">Sign in to access your attendance dashboard</p>
            </div>
            
            <AuthForm />
            
            <div className="mt-6 text-sm text-gray-500 md:hidden">
              <p>Demo credentials:</p>
              <p>Teacher: teacher@example.com / password123</p>
              <p>Student: student@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
