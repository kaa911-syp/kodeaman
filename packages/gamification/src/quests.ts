export interface Quest {
  key: string;
  nameEn: string;
  nameId: string;
  descriptionEn: string;
  descriptionId: string;
  targetCount: number;
  category?: string;
  rewardXp: number;
  rewardBadge?: string;
}

export const quests: Quest[] = [
  {
    key: "quest-fix-3-injection-issues",
    nameEn: "Injection Hunter",
    nameId: "Pemburu Injection",
    descriptionEn: "Fix 3 injection vulnerabilities (SQL injection, command injection, etc.)",
    descriptionId: "Perbaiki 3 kerentanan injection (SQL injection, command injection, dll.)",
    targetCount: 3,
    category: "sqli",
    rewardXp: 50,
    rewardBadge: "quest-master",
  },
  {
    key: "quest-fix-5-xss-issues",
    nameEn: "XSS Warrior",
    nameId: "Pejuang XSS",
    descriptionEn: "Fix 5 cross-site scripting vulnerabilities",
    descriptionId: "Perbaiki 5 kerentanan cross-site scripting",
    targetCount: 5,
    category: "xss",
    rewardXp: 75,
    rewardBadge: "quest-master",
  },
  {
    key: "quest-clean-week",
    nameEn: "Clean Week",
    nameId: "Minggu Bersih",
    descriptionEn: "Go 7 days without any high-severity findings",
    descriptionId: "7 hari tanpa temuan severity tinggi",
    targetCount: 7,
    rewardXp: 100,
  },
  {
    key: "quest-learn-3-lessons",
    nameEn: "Knowledge Seeker",
    nameId: "Pencari Ilmu",
    descriptionEn: "Complete 3 security lessons",
    descriptionId: "Selesaikan 3 pelajaran keamanan",
    targetCount: 3,
    rewardXp: 40,
  },
];

export function getQuest(key: string): Quest | undefined {
  return quests.find((q) => q.key === key);
}

export function getQuestsByCategory(category: string): Quest[] {
  return quests.filter((q) => q.category === category);
}
