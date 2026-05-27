import enStrings from "./locales/en.json" with { type: "json" };

export type Locale = "en";

type NestedRecord = { [key: string]: string | NestedRecord };

const locales: Record<Locale, NestedRecord> = {
  en: enStrings as unknown as NestedRecord,
};

function resolve(obj: NestedRecord, key: string): string | undefined {
  const parts = key.split(".");
  let current: NestedRecord | string = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[part] as NestedRecord | string;
  }
  return typeof current === "string" ? current : undefined;
}

export class Translator {
  private locale: Locale;

  constructor(locale: Locale = "en") {
    this.locale = locale;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const raw = resolve(locales[this.locale], key) ?? resolve(locales.en, key) ?? key;
    if (!params) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
      params[name] !== undefined ? String(params[name]) : `{${name}}`,
    );
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  getLocale(): Locale {
    return this.locale;
  }

  getSeverityLabel(severity: string): string {
    return this.t(`severity.${severity}`);
  }

  getStatusLabel(status: string): string {
    return this.t(`status.${status}`);
  }

  getBadgeLabel(badgeKey: string): string {
    return this.t(`badges.${badgeKey}`);
  }
}
