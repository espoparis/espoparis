/**
 * Provider-neutral boundary for Google Classroom.
 * No credentials or Classroom API writes are enabled in this safe redesign copy.
 */
export type ClassroomCourseRef = {
  classroomCourseId: string;
  academicCourseId: string;
  teacherEmails: string[];
};

export type ClassroomAnnouncementRef = {
  classroomCourseId: string;
  title: string;
  portalLessonUrl: string;
};

export interface ClassroomGateway {
  listStudentCourseIds(studentEmail: string): Promise<string[]>;
  publishRecordingAnnouncement(input: ClassroomAnnouncementRef): Promise<{ announcementId: string }>;
}

export class DisabledClassroomGateway implements ClassroomGateway {
  async listStudentCourseIds(): Promise<string[]> {
    return [];
  }

  async publishRecordingAnnouncement(): Promise<{ announcementId: string }> {
    throw new Error("Google Classroom integration is not configured");
  }
}
