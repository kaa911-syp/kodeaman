export type LessonLevel = "beginner" | "intermediate" | "advanced";

export interface LessonMeta {
  id: string;
  slug: string;
  titleEn: string;
  titleId: string;
  level: LessonLevel;
  estimatedMinutes: number;
  categories: string[];
  tags: string[];
  contentPath: string;
}
