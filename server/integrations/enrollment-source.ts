function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const ENROLLMENT_SOURCE_COLUMNS = {
  timestamp: 0,
  email: 1,
  fullName: 2,
  dateOfBirth: 3,
  educationLevel: 4,
  academicDegree: 5,
  latestCertificate: 6,
  hawzaStudies: 7,
  primaryLanguage: 8,
  personalPhoto: 9,
  identityDocument: 10,
  countryCity: 11,
  phone: 12,
} as const;

export type EnrollmentLanguage = "Arabic" | "English" | "French" | "Persian" | "Turkish" | "Azerbaijani";

export type RawEnrollmentRow = unknown[];

export type CanonicalEnrollmentSubmission = {
  submissionDate: string;
  language: EnrollmentLanguage;
  fullName: string;
  email: string;
  dateOfBirth: string;
  educationLevel: string;
  academicDegree: string;
  latestCertificate: string;
  hawzaStudies: string;
  primaryLanguage: string;
  personalPhoto: string;
  identityDocument: string;
  countryCity: string;
  phone: string;
};

function text(value: unknown) {
  return value == null ? "" : String(value).trim();
}

export function normalizeEnrollmentResponseRow(
  row: RawEnrollmentRow,
  language: EnrollmentLanguage,
): CanonicalEnrollmentSubmission {
  if (row.length < 13) {
    throw new Error(`Enrollment response row has ${row.length} columns; expected at least 13.`);
  }

  const fullName = text(row[ENROLLMENT_SOURCE_COLUMNS.fullName]);
  const email = normalizeEmail(text(row[ENROLLMENT_SOURCE_COLUMNS.email]));

  if (!fullName) throw new Error("Enrollment response is missing the applicant full name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enrollment response has an invalid email address.");

  return {
    submissionDate: text(row[ENROLLMENT_SOURCE_COLUMNS.timestamp]),
    language,
    fullName,
    email,
    dateOfBirth: text(row[ENROLLMENT_SOURCE_COLUMNS.dateOfBirth]),
    educationLevel: text(row[ENROLLMENT_SOURCE_COLUMNS.educationLevel]),
    academicDegree: text(row[ENROLLMENT_SOURCE_COLUMNS.academicDegree]),
    latestCertificate: text(row[ENROLLMENT_SOURCE_COLUMNS.latestCertificate]),
    hawzaStudies: text(row[ENROLLMENT_SOURCE_COLUMNS.hawzaStudies]),
    primaryLanguage: text(row[ENROLLMENT_SOURCE_COLUMNS.primaryLanguage]),
    personalPhoto: text(row[ENROLLMENT_SOURCE_COLUMNS.personalPhoto]),
    identityDocument: text(row[ENROLLMENT_SOURCE_COLUMNS.identityDocument]),
    countryCity: text(row[ENROLLMENT_SOURCE_COLUMNS.countryCity]),
    phone: text(row[ENROLLMENT_SOURCE_COLUMNS.phone]),
  };
}

export const CENTRAL_ENROLLMENT_HEADERS = [
  "Application Id",
  "Submission Date",
  "Language",
  "Full name",
  "Email",
  "Date of birth",
  "Level of education",
  "Academic degree",
  "Latest academic certificate",
  "Hawza studies",
  "Primary language",
  "Personal photo",
  "Identity/passport",
  "Country and city",
  "Phone number",
  "Status",
  "Student folder",
  "Notes",
] as const;

export function toCentralEnrollmentRow(input: {
  applicationId: string;
  submission: CanonicalEnrollmentSubmission;
  status?: string;
  studentFolderUrl?: string;
  notes?: string;
}) {
  const { applicationId, submission } = input;
  return [
    applicationId,
    submission.submissionDate,
    submission.language,
    submission.fullName,
    submission.email,
    submission.dateOfBirth,
    submission.educationLevel,
    submission.academicDegree,
    submission.latestCertificate,
    submission.hawzaStudies,
    submission.primaryLanguage,
    submission.personalPhoto,
    submission.identityDocument,
    submission.countryCity,
    submission.phone,
    input.status ?? "Pending Review",
    input.studentFolderUrl ?? "",
    input.notes ?? "",
  ];
}

export function parseApplicationSequence(applicationId: string) {
  const match = /^AIC-(\d{4})-(\d{4,6})$/.exec(applicationId.trim());
  if (!match) return null;
  return { year: Number(match[1]), sequence: Number(match[2]) };
}

export function buildApplicationId(sequence: number, year = 2026) {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999999) {
    throw new Error("Application sequence must be an integer between 1 and 999999.");
  }
  return `AIC-${year}-${String(sequence).padStart(4, "0")}`;
}
