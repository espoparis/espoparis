export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "admin" | "teacher" | "student";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type CourseType = "diploma" | "bachelors";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";
export type MediaKind = "video" | "document";
export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: AppRole;
          approval_status: ApprovalStatus;
          full_name: string;
          avatar_path: string | null;
          bio: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: AppRole;
          approval_status?: ApprovalStatus;
          full_name: string;
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: AppRole;
          approval_status?: ApprovalStatus;
          full_name?: string;
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_applications: {
        Row: {
          profile_id: string;
          has_taken_courses: boolean;
          primary_interest: string;
          previous_courses: string;
          submitted_at: string;
        };
        Insert: {
          profile_id: string;
          has_taken_courses?: boolean;
          primary_interest: string;
          previous_courses?: string;
          submitted_at?: string;
        };
        Update: {
          profile_id?: string;
          has_taken_courses?: boolean;
          primary_interest?: string;
          previous_courses?: string;
          submitted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_applications_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          slug: string;
          description: string;
          type: CourseType;
          level: CourseLevel;
          duration_label: string;
          thumbnail_path: string | null;
          status: CourseStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          slug: string;
          description: string;
          type: CourseType;
          level: CourseLevel;
          duration_label: string;
          thumbnail_path?: string | null;
          status?: CourseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          type?: CourseType;
          level?: CourseLevel;
          duration_label?: string;
          thumbnail_path?: string | null;
          status?: CourseStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_media: {
        Row: {
          id: string;
          course_id: string;
          kind: MediaKind;
          title: string;
          storage_path: string;
          thumbnail_path: string | null;
          mime_type: string;
          size_bytes: number;
          duration_seconds: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          kind: MediaKind;
          title: string;
          storage_path: string;
          thumbnail_path?: string | null;
          mime_type: string;
          size_bytes: number;
          duration_seconds?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          kind?: MediaKind;
          title?: string;
          storage_path?: string;
          thumbnail_path?: string | null;
          mime_type?: string;
          size_bytes?: number;
          duration_seconds?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_media_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          status: EnrollmentStatus;
          applied_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          status?: EnrollmentStatus;
          applied_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          status?: EnrollmentStatus;
          applied_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_reviews: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_reviews_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_approved_enrollment: {
        Args: {
          course_uuid: string;
        };
        Returns: boolean;
      };
      is_course_teacher: {
        Args: {
          course_uuid: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      approval_status: ApprovalStatus;
      course_type: CourseType;
      course_level: CourseLevel;
      course_status: CourseStatus;
      media_kind: MediaKind;
      enrollment_status: EnrollmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
