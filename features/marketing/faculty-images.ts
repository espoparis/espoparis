/** Portrait assets supplied by the seminary and optimized for the web. */
export const FOUNDER_IMAGE = "/faculty/founder-mohammad-ismail-al-khaliq.webp";

export const facultyImages: Record<string, string> = {
  "founder-mohammad-ismail-al-khaliq": "/faculty/founder-mohammad-ismail-al-khaliq.webp",
  "mujtaba-al-khaliq": "/faculty/mujtaba-al-khaliq.webp",
  "mustafa-al-khaliq": "/faculty/mustafa-al-khaliq.webp",
  "mohammad-hussein-al-khaliq": "/faculty/mohammad-hussein-al-khaliq.webp",
  "abdullah-shami-zadeh": "/faculty/abdullah-shami-zadeh.webp",
  "mohammad-ali-al-hajj-al-amili": "/faculty/mohammad-ali-al-hajj-al-amili.webp",
  "fares-al-khatib": "/faculty/shaykh-fares-al-khatib.jpg",
};

export function getFacultyImage(id: string) {
  return facultyImages[id];
}
