import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Edit3, CheckCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";

interface FormData {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  year: number;
  phone: string;
  address: string;
}

const departments = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Cyber Security",
  "Artificial Intelligence",
];

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = parseInt(id ?? "0");

  const { data: student, isLoading } = trpc.student.getById.useQuery(
    { id: studentId },
    { enabled: studentId > 0 }
  );

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: 1,
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year,
        phone: student.phone ?? "",
        address: student.address ?? "",
      });
    }
  }, [student]);

  const utils = trpc.useUtils();
  const updateMutation = trpc.student.update.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      utils.student.getById.invalidate({ id: studentId });
      navigate("/students");
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.rollNumber.trim()) newErrors.rollNumber = "Roll number is required";
    if (!form.department) newErrors.department = "Department is required";
    if (form.year < 1 || form.year > 5) newErrors.year = "Year must be 1-5";
    if (form.phone && !/^[+]?[\d\s-]{7,}$/.test(form.phone))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    updateMutation.mutate({
      id: studentId,
      name: form.name.trim(),
      email: form.email.trim(),
      rollNumber: form.rollNumber.trim(),
      department: form.department,
      year: form.year,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
    });
  };

  const updateField = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Student Not Found</h2>
        <p className="text-gray-500 mt-2">
          The student you're looking for doesn't exist.
        </p>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/students"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Edit3 className="h-7 w-7 text-blue-600" />
          Edit Student
        </h1>
        <p className="text-gray-500 mt-1">
          Update the information for{" "}
          <span className="font-medium text-gray-700">{student.name}</span>.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.rollNumber}
              onChange={(e) => updateField("rollNumber", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.rollNumber
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
            />
            {errors.rollNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.department
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-white`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              value={form.year}
              onChange={(e) => updateField("year", parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.phone
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {updateMutation.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Update Student
              </>
            )}
          </button>
          <Link
            to="/students"
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
