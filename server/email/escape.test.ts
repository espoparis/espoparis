import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeHtml, escapeHtmlWithBreaks } from "./escape.ts";

test("escapes the characters that can break out of an HTML context", () => {
  assert.equal(escapeHtml("<script>"), "&lt;script&gt;");
  assert.equal(escapeHtml('a "quoted" value'), "a &quot;quoted&quot; value");
  assert.equal(escapeHtml("it's"), "it&#39;s");
  assert.equal(escapeHtml("Tom & Jerry"), "Tom &amp; Jerry");
});

test("escapes ampersands once, not twice", () => {
  assert.equal(escapeHtml("&lt;"), "&amp;lt;");
});

test("neutralises an injected anchor in a submitted name", () => {
  const injected = '<a href="https://evil.example">Click</a>';

  assert.equal(
    escapeHtml(injected),
    "&lt;a href=&quot;https://evil.example&quot;&gt;Click&lt;/a&gt;",
  );
  assert.ok(!escapeHtml(injected).includes("<a "));
});

test("leaves ordinary text untouched", () => {
  assert.equal(escapeHtml("Shaykh Isma‘il al-Khaliq"), "Shaykh Isma‘il al-Khaliq");
  assert.equal(escapeHtml("مركز الإمام"), "مركز الإمام");
});

test("converts newlines to breaks after escaping", () => {
  assert.equal(escapeHtmlWithBreaks("one\ntwo"), "one<br />two");
  assert.equal(escapeHtmlWithBreaks("one\r\ntwo"), "one<br />two");
  assert.equal(escapeHtmlWithBreaks("<b>\nx"), "&lt;b&gt;<br />x");
});
