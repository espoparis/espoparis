import test from "node:test";
import assert from "node:assert/strict";
import { driveFileId, validImageReference, validateUpload, MAX_UPLOAD_BYTES } from "./files.ts";
test("Drive links normalize without accepting lookalike hosts", () => {
  assert.equal(driveFileId("https://drive.google.com/file/d/abcdefghijk123/view"), "abcdefghijk123");
  assert.equal(driveFileId("https://drive.google.com/open?id=abcdefghijk123"), "abcdefghijk123");
  assert.equal(driveFileId("https://drive.google.com.attacker.test/file/d/abcdefghijk123/view"), "");
  assert.equal(driveFileId("javascript:alert(1)"), "");
});
test("public image references cannot request arbitrary remote or internal URLs", () => {
  assert.equal(validImageReference("/api/content-media/abcdefghijk123"), true);
  assert.equal(validImageReference("https://example.com/image.png"), false);
  assert.equal(validImageReference("/api/admin/secrets"), false);
});
test("uploads verify bytes, purpose and size rather than trusting extensions", () => {
  const pdf = new TextEncoder().encode("%PDF-1.7\nfile");
  assert.doesNotThrow(() => validateUpload(pdf,"application/pdf","book-pdf"));
  assert.throws(() => validateUpload(pdf,"image/jpeg","cms-image"));
  assert.throws(() => validateUpload(new TextEncoder().encode("<svg/>"),"image/svg+xml","cms-image"));
  assert.throws(() => validateUpload(new Uint8Array(MAX_UPLOAD_BYTES+1),"application/pdf","book-pdf"));
});
