export interface Badge {
  key: string;
  nameEn: string;
  nameId: string;
  descriptionEn: string;
  descriptionId: string;
  icon: string;
}

export const badges: Badge[] = [
  {
    key: "first-fix",
    nameEn: "First Fix",
    nameId: "Perbaikan Pertama",
    descriptionEn: "Fixed your first security issue",
    descriptionId: "Memperbaiki masalah keamanan pertamamu",
    icon: "shield-check",
  },
  {
    key: "first-sqli-fix",
    nameEn: "SQL Injection Slayer",
    nameId: "Pembasmi SQL Injection",
    descriptionEn: "Fixed your first SQL injection vulnerability",
    descriptionId: "Memperbaiki kerentanan SQL injection pertamamu",
    icon: "database-lock",
  },
  {
    key: "first-xss-fix",
    nameEn: "XSS Exterminator",
    nameId: "Pembasmi XSS",
    descriptionEn: "Fixed your first XSS vulnerability",
    descriptionId: "Memperbaiki kerentanan XSS pertamamu",
    icon: "code-lock",
  },
  {
    key: "clean-pr",
    nameEn: "Clean PR",
    nameId: "PR Bersih",
    descriptionEn: "Submitted a PR with zero high-severity findings",
    descriptionId: "Mengirim PR tanpa temuan severity tinggi",
    icon: "sparkles",
  },
  {
    key: "streak-3",
    nameEn: "3-PR Streak",
    nameId: "Streak 3 PR",
    descriptionEn: "3 consecutive clean PRs",
    descriptionId: "3 PR bersih berturut-turut",
    icon: "flame",
  },
  {
    key: "streak-7",
    nameEn: "7-PR Streak",
    nameId: "Streak 7 PR",
    descriptionEn: "7 consecutive clean PRs",
    descriptionId: "7 PR bersih berturut-turut",
    icon: "flame-double",
  },
  {
    key: "quest-master",
    nameEn: "Quest Master",
    nameId: "Master Quest",
    descriptionEn: "Completed your first quest",
    descriptionId: "Menyelesaikan quest pertamamu",
    icon: "trophy",
  },
  {
    key: "security-champion",
    nameEn: "Security Champion",
    nameId: "Juara Keamanan",
    descriptionEn: "Earned 100+ XP from security fixes",
    descriptionId: "Mendapatkan 100+ XP dari perbaikan keamanan",
    icon: "crown",
  },
];

export function getBadge(key: string): Badge | undefined {
  return badges.find((b) => b.key === key);
}
