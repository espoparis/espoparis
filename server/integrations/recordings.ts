export type RecordingSource = "google-meet" | "manual-upload" | "external-video";
export type RecordingState = "pending-review" | "approved" | "published" | "archived";

export type LessonRecording = {
  id: string;
  lessonId: string;
  source: RecordingSource;
  driveFileId?: string;
  storageAssetId?: string;
  durationSeconds?: number;
  state: RecordingState;
  capturedAt?: Date;
  publishedAt?: Date;
};

export interface RecordingRepository {
  listForLesson(lessonId: string): Promise<LessonRecording[]>;
  save(recording: LessonRecording): Promise<void>;
}
