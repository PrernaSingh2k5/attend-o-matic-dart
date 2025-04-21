
import { User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceTableProps {
  students: User[];
  records: {
    studentId: string;
    status: string;
    date: string;
  }[];
}

export function AttendanceTable({ students, records }: AttendanceTableProps) {
  return (
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
          const record = records.find(r => r.studentId === student.id);
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
  );
}
