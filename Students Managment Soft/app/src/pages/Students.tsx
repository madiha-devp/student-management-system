import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Edit3,
  Trash2,
  UserPlus,
  GraduationCap,
  AlertTriangle,
  X,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: students, isLoading } = trpc.student.list.useQuery();
  const deleteMutation = trpc.student.delete.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    },
  });

  const filteredStudents = students?.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete !== null) {
      deleteMutation.mutate({ id: studentToDelete });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-blue-600" />
            All Students
          </h1>
          <p className="text-gray-500 mt-1">
            {students?.length ?? 0} students registered in the system
          </p>
        </div>
        <Link
          to="/add-student"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Student
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, roll number, department, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : filteredStudents && filteredStudents.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-right py-4 px-4 sm:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {student.rollNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm text-gray-700">
                      {student.department}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Year {student.year}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm text-gray-500">
                      {student.phone ?? "N/A"}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit-student/${student.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(student.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchQuery ? "No students found" : "No students yet"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery
              ? "Try adjusting your search query"
              : "Start by adding your first student to the system"}
          </p>
          {!searchQuery && (
            <Link
              to="/add-student"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete Student
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
