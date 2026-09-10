import type { CourseGrade, AcademicTermRecord } from "./records.ts";

export type TranscriptCourseLine = {
  courseOfferingId: string;
  displayName: string;
  finalScore?: number;
  result: "passed" | "failed" | "in-progress";
};

export type StudentTranscript = {
  enrollmentId: string;
  studentNumber: string;
  studentName: string;
  academicYear: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  termAverage?: number;
  standing: AcademicTermRecord["standing"];
  courses: TranscriptCourseLine[];
  generatedAt: Date;
};

export function calculatePublishedAverage(grades: CourseGrade[]): number | undefined {
  const numeric = grades.filter((g) => g.published && typeof g.earned === "number" && typeof g.possible === "number" && g.possible > 0);
  if (!numeric.length) return undefined;
  const total = numeric.reduce((sum, g) => sum + (g.earned as number) / (g.possible as number) * 100, 0);
  return Math.round((total / numeric.length) * 100) / 100;
}

export function buildTranscript(input: {
  enrollmentId: string;
  studentNumber: string;
  studentName: string;
  academicYear: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  standing: AcademicTermRecord["standing"];
  courses: TranscriptCourseLine[];
  termAverage?: number;
  generatedAt?: Date;
}): StudentTranscript {
  return { ...input, generatedAt: input.generatedAt ?? new Date() };
}
