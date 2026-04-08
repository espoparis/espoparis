import assert from "node:assert/strict";
import test from "node:test";
import { coercePage, paginateItems } from "../lib/pagination.ts";

test("coercePage falls back to page one for invalid input", () => {
  assert.equal(coercePage(undefined), 1);
  assert.equal(coercePage("0"), 1);
  assert.equal(coercePage("-5"), 1);
  assert.equal(coercePage("not-a-number"), 1);
});

test("coercePage accepts positive page values", () => {
  assert.equal(coercePage("3"), 3);
  assert.equal(coercePage(["7", "2"]), 7);
});

test("paginateItems slices the expected page range", () => {
  const result = paginateItems(
    Array.from({ length: 14 }, (_, index) => index + 1),
    2,
    6
  );

  assert.deepEqual(result.items, [7, 8, 9, 10, 11, 12]);
  assert.equal(result.totalItems, 14);
  assert.equal(result.totalPages, 3);
  assert.equal(result.currentPage, 2);
  assert.equal(result.startIndex, 6);
  assert.equal(result.endIndex, 12);
});

test("paginateItems clamps out-of-range pages to the last available page", () => {
  const result = paginateItems(["a", "b", "c"], 99, 2);

  assert.deepEqual(result.items, ["c"]);
  assert.equal(result.currentPage, 2);
  assert.equal(result.totalPages, 2);
  assert.equal(result.startIndex, 2);
  assert.equal(result.endIndex, 3);
});

test("paginateItems stays stable for empty datasets", () => {
  const result = paginateItems([], 4, 6);

  assert.deepEqual(result.items, []);
  assert.equal(result.currentPage, 1);
  assert.equal(result.totalPages, 1);
  assert.equal(result.startIndex, 0);
  assert.equal(result.endIndex, 0);
});
