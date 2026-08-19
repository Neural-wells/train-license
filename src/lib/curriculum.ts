/**
 * The learning path shown on the landing page — THE navigation surface of the
 * app. One unit per reading chapter, in study order, each paired with the
 * practice category that drills it ("exam" pairs the exam-guide chapter with
 * the mock exam; null = study-only).
 */
export interface CurriculumUnit {
  chapter: string; // reading chapter slug (title comes from the chapter file)
  icon: string;
  practice: string | "exam" | null; // practice category slug
}

export const CURRICULUM: CurriculumUnit[] = [
  { chapter: "road-basics", icon: "📘", practice: null },
  { chapter: "signs-danger-priority", icon: "⚠️", practice: "signs-danger-priority" },
  { chapter: "signs-prohibition-obligation", icon: "🚫", practice: "signs-prohibition-obligation" },
  { chapter: "signs-parking-indication", icon: "🅿️", practice: "signs-parking-indication" },
  { chapter: "priority", icon: "🔀", practice: "priority" },
  { chapter: "speed", icon: "🏎️", practice: "speed" },
  { chapter: "maneuvers", icon: "↩️", practice: "maneuvers" },
  { chapter: "stopping-parking", icon: "🚏", practice: "parking" },
  { chapter: "vulnerable-users", icon: "🚲", practice: "vulnerable-users" },
  { chapter: "motorways", icon: "🛣️", practice: "motorways-special" },
  { chapter: "driver-vehicle", icon: "🪪", practice: "driver-fitness-documents" },
  { chapter: "fitness-alcohol", icon: "🩺", practice: "driver-fitness-documents" },
  { chapter: "accidents-emergencies", icon: "🚨", practice: "driver-fitness-documents" },
  { chapter: "eco-defensive", icon: "🌿", practice: "driver-fitness-documents" },
  { chapter: "exam-guide", icon: "🎓", practice: "exam" },
];
