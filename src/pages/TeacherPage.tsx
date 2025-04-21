
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { Layout } from "@/components/Layout";

const TeacherPage = () => {
  return (
    <Layout requireAuth>
      <TeacherDashboard />
    </Layout>
  );
};

export default TeacherPage;
