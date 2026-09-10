import type { PublishedBookMetadata, PublishedLessonMetadata } from "./types";

export interface LibraryRepository {
  listPublishedBooks(): Promise<PublishedBookMetadata[]>;
  findPublishedBookBySlug(slug: string): Promise<PublishedBookMetadata | null>;
}

export interface LearningRepository {
  listPublishedLessons(courseId?: string): Promise<PublishedLessonMetadata[]>;
  findPublishedLesson(id: string): Promise<PublishedLessonMetadata | null>;
}

/**
 * Safe launch adapter: the public site shows no invented books or recordings.
 * Replace with a database-backed repository once the first approved records exist.
 */
export const emptyLibraryRepository: LibraryRepository = {
  async listPublishedBooks() {
    return [];
  },
  async findPublishedBookBySlug() {
    return null;
  },
};

export const emptyLearningRepository: LearningRepository = {
  async listPublishedLessons() {
    return [];
  },
  async findPublishedLesson() {
    return null;
  },
};
