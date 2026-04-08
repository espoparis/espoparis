import assert from "node:assert/strict";
import test from "node:test";
import { courseCatalogFilterSchema } from "../lib/validation/course.ts";
import {
  adminCourseFilterSchema,
  adminUserFilterSchema,
  studentEnrollmentFilterSchema,
  teacherCourseFilterSchema,
  teacherEnrollmentFilterSchema,
  teacherRosterFilterSchema,
} from "../lib/validation/operations.ts";

test("course catalog filters apply the expected defaults", () => {
  const result = courseCatalogFilterSchema.parse({});

  assert.deepEqual(result, {
    q: "",
    type: "all",
    level: "all",
    sort: "recent",
  });
});

test("course catalog filters trim user input", () => {
  const result = courseCatalogFilterSchema.parse({
    q: "  visual storytelling  ",
    type: "diploma",
    level: "advanced",
    sort: "rating-desc",
  });

  assert.deepEqual(result, {
    q: "visual storytelling",
    type: "diploma",
    level: "advanced",
    sort: "rating-desc",
  });
});

test("admin user filters include sort defaults", () => {
  const result = adminUserFilterSchema.parse({});

  assert.deepEqual(result, {
    q: "",
    role: "all",
    status: "all",
    sort: "recent",
  });
});

test("teacher roster filters preserve coverage-first sorting by default", () => {
  const result = teacherRosterFilterSchema.parse({});

  assert.deepEqual(result, {
    q: "",
    scope: "all",
    sort: "coverage-desc",
  });
});

test("teacher course filters accept sort and status combinations", () => {
  const result = teacherCourseFilterSchema.parse({
    status: "published",
    type: "bachelors",
    sort: "title-asc",
  });

  assert.deepEqual(result, {
    q: "",
    status: "published",
    type: "bachelors",
    sort: "title-asc",
  });
});

test("admin course filters accept operational lane and sort combinations", () => {
  const result = adminCourseFilterSchema.parse({
    lane: "watchlist",
    status: "draft",
    sort: "rating-desc",
  });

  assert.deepEqual(result, {
    q: "",
    lane: "watchlist",
    status: "draft",
    sort: "rating-desc",
  });
});

test("student enrollment filters expose both status and sort controls", () => {
  const result = studentEnrollmentFilterSchema.parse({
    status: "pending",
    sort: "teacher-asc",
  });

  assert.deepEqual(result, {
    q: "",
    status: "pending",
    sort: "teacher-asc",
  });
});

test("teacher enrollment filters support queue and sort defaults", () => {
  const result = teacherEnrollmentFilterSchema.parse({});

  assert.deepEqual(result, {
    q: "",
    status: "all",
    lane: "all",
    sort: "recent",
  });
});
