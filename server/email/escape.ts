const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes a value for interpolation into an HTML email body.
 *
 * Contact submissions are attacker-controlled, so every value that reaches the
 * notification template has to be encoded before it lands in markup.
 */
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

/** Escapes a value and preserves author line breaks as `<br />`. */
export function escapeHtmlWithBreaks(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}
