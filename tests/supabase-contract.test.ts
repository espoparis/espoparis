import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const schemaMigrationPath = resolve(
  currentDir,
  "../supabase/migrations/0001_initial_schema.sql"
);
const storageMigrationPath = resolve(
  currentDir,
  "../supabase/migrations/0002_storage_policies_and_indexes.sql"
);
const seedPath = resolve(currentDir, "../supabase/seed.sql");

async function readFixture(path: string) {
  return readFile(path, "utf8");
}

test("initial schema migration defines the expected enum types", async () => {
  const migration = await readFixture(schemaMigrationPath);

  for (const enumName of [
    "app_role",
    "approval_status",
    "course_type",
    "course_level",
    "course_status",
    "media_kind",
    "enrollment_status",
  ]) {
    assert.match(migration, new RegExp(`create type public\\.${enumName}`, "i"));
  }
});

test("initial schema migration defines the core application tables", async () => {
  const migration = await readFixture(schemaMigrationPath);

  for (const tableName of [
    "profiles",
    "student_applications",
    "courses",
    "course_media",
    "enrollments",
    "course_reviews",
  ]) {
    assert.match(
      migration,
      new RegExp(`create table if not exists public\\.${tableName}`, "i")
    );
  }
});

test("initial schema migration enables RLS and key access helpers", async () => {
  const migration = await readFixture(schemaMigrationPath);

  assert.match(migration, /create or replace function public\.is_admin\(\)/i);
  assert.match(migration, /create or replace function public\.is_course_teacher/i);
  assert.match(migration, /create or replace function public\.has_approved_enrollment/i);

  for (const tableName of [
    "profiles",
    "student_applications",
    "courses",
    "course_media",
    "enrollments",
    "course_reviews",
  ]) {
    assert.match(
      migration,
      new RegExp(`alter table public\\.${tableName} enable row level security`, "i")
    );
  }
});

test("storage migration defines the expected bucket policies and indexes", async () => {
  const migration = await readFixture(storageMigrationPath);

  for (const snippet of [
    "profiles_role_approval_created_idx",
    "course_reviews_course_created_idx",
    "enrollments_course_status_applied_idx",
    "enrollments_student_status_applied_idx",
    "bucket_id = 'avatars'",
    "bucket_id = 'course-thumbnails'",
    "bucket_id = 'course-media'",
  ]) {
    assert.match(migration, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("seed scaffold still documents the admin bootstrap flow", async () => {
  const seed = await readFixture(seedPath);

  assert.match(seed, /create the first admin auth user manually/i);
  assert.match(seed, /update public\.profiles/i);
  assert.match(seed, /approval_status = 'approved'/i);
});
