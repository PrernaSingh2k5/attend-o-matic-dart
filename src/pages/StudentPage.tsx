
import { StudentDashboard } from "@/components/StudentDashboard";
import { Layout } from "@/components/Layout";

const StudentPage = () => {
  return (
    <Layout requireAuth>
      <StudentDashboard />
    </Layout>
  );
};

export default StudentPage;
