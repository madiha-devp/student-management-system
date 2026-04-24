import { Link } from "react-router";
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Home() {
  const { data: students } = trpc.student.list.useQuery();

  const totalStudents = students?.length ?? 0;
  const csStudents =
    students?.filter((s) => s.department.toLowerCase().includes("computer"))
      .length ?? 0;
  const seStudents =
    students?.filter((s) => s.department.toLowerCase().includes("software"))
      .length ?? 0;
  const itStudents =
    students?.filter((s) => s.department.toLowerCase().includes("it"))
      .length ?? 0;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Computer Science",
      value: csStudents,
      icon: GraduationCap,
      color: "bg-emerald-500",
    },
    {
      label: "Software Engineering",
      value: seStudents,
      icon: BookOpen,
      color: "bg-amber-500",
    },
    {
      label: "Information Technology",
      value: itStudents,
      icon: UserPlus,
      color: "bg-rose-500",
    },
  ];

  const departments = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Cyber Security",
    "Artificial Intelligence",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Student Management System
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mb-8">
          A complete full-stack application to manage student records. Add,
          view, edit, and delete student information with ease.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/students"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View All Students
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/add-student"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
          >
            <UserPlus className="h-4 w-4" />
            Add New Student
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features & Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: UserPlus,
                title: "Add Students",
                desc: "Register new students with complete details",
              },
              {
                icon: Users,
                title: "View All Students",
                desc: "Browse and search through all student records",
              },
              {
                icon: GraduationCap,
                title: "Edit Information",
                desc: "Update student details anytime",
              },
              {
                icon: BookOpen,
                title: "Delete Records",
                desc: "Remove students who have graduated or left",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Departments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((dept) => (
              <div
                key={dept}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {dept}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students */}
      {students && students.length > 0 && (
        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recently Added Students
            </h2>
            <Link
              to="/students"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Roll Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.slice(-5).map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Year {student.year}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
