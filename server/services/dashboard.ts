import { listAllCourses, listTeacherCourses } from "@/server/queries/courses";
import { listTeacherEnrollments, listStudentEnrollments } from "@/server/repositories/enrollments";
import { listProfiles } from "@/server/repositories/profiles";

export async function getAdminDashboardData() {
  const [profiles, courses] = await Promise.all([listProfiles(), listAllCourses()]);

  return {
    totalUsers: profiles.length,
    pendingUsers: profiles.filter((profile) => profile.approval_status === "pending").length,
    totalTeachers: profiles.filter((profile) => profile.role === "teacher").length,
    totalStudents: profiles.filter((profile) => profile.role === "student").length,
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.status === "published").length,
  };
}

export async function getTeacherDashboardData(teacherId: string) {
  const [courses, enrollments] = await Promise.all([
    listTeacherCourses(teacherId),
    listTeacherEnrollments(teacherId),
  ]);

  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.status === "published").length,
    pendingEnrollments: enrollments.filter((enrollment) => enrollment.status === "pending").length,
    approvedStudents: enrollments.filter((enrollment) => enrollment.status === "approved").length,
  };
}

export async function getStudentDashboardData(studentId: string) {
  const enrollments = await listStudentEnrollments(studentId);

  return {
    totalApplications: enrollments.length,
    activeCourses: enrollments.filter((item) => item.status === "approved").length,
    pendingApplications: enrollments.filter((item) => item.status === "pending").length,
  };
}
