/**
 * Portrait assets, kept out of `messages/*.json` because an image path is not
 * translatable content. Message entries carry a stable `id`; this maps that id
 * to a file in `public/faculty`.
 *
 * Faculty without an entry here render as a name-and-role card. Portraits are
 * only added for scholars whose photographs the seminary has supplied.
 */
export const FOUNDER_IMAGE = "/faculty/sheikh-ismail-al-khaliq.jpg";

export const facultyImages: Record<string, string> = {
  "mustafa-al-khaliq": "/faculty/shaykh-mustafa-al-khaliq.jpg",
  "fares-al-khatib": "/faculty/shaykh-fares-al-khatib.jpg",
};

export function getFacultyImage(id: string) {
  return facultyImages[id];
}
