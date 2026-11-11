import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import hu from "./locales/hu.json";
import de from "./locales/de.json";
import es from "./locales/es.json";

const locales = { en, hu, de, es };
const translations = Object.entries(locales);

/** Flattens to "a.b.c" -> value, treating arrays as leaves. */
function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? flatten(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value]]
  );
}

const flat = Object.fromEntries(
  translations.map(([lang, json]) => [lang, Object.fromEntries(flatten(json))])
);
const keys = Object.keys(flat.en);

const placeholdersIn = (value) =>
  typeof value === "string"
    ? [...value.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort()
    : [];

describe("locale files", () => {
  it.each(translations.map(([lang]) => lang))(
    "%s defines exactly the same keys as en",
    (lang) => {
      // A key missing from one locale renders as the raw key path in the UI.
      expect(Object.keys(flat[lang]).sort()).toEqual(keys.slice().sort());
    }
  );

  it.each(translations.map(([lang]) => lang))("%s has no empty translations", (lang) => {
    const blank = keys.filter((key) => {
      const value = flat[lang][key];
      // caughtCat.article_* are intentionally empty outside English — the article
      // is baked into the heading for languages BreedHeader does not compute one for.
      if (key.startsWith("caughtCat.article_")) return false;
      return typeof value === "string" && value.trim() === "";
    });
    expect(blank).toEqual([]);
  });

  it.each(translations.filter(([lang]) => lang !== "en").map(([lang]) => lang))(
    "%s uses the same interpolation placeholders as en",
    (lang) => {
      const mismatched = keys
        // The heading is the one deliberate exception: BreedHeader only computes
        // {{article}} for English, so other locales must not reference it.
        .filter((key) => key !== "caughtCat.heading")
        .filter(
          (key) =>
            placeholdersIn(flat[lang][key]).join() !==
            placeholdersIn(flat.en[key]).join()
        );
      expect(mismatched).toEqual([]);
    }
  );

  it.each(translations.filter(([lang]) => lang !== "en").map(([lang]) => lang))(
    "%s never references {{article}}, which only English fills",
    (lang) => {
      // BreedHeader passes article: "" for non-English, so any locale using the
      // placeholder would render a stray gap where the article should be.
      const offenders = keys.filter(
        (key) =>
          typeof flat[lang][key] === "string" && flat[lang][key].includes("{{article}}")
      );
      expect(offenders).toEqual([]);
    }
  );

  it.each(translations.map(([lang]) => lang))(
    "%s exposes chat.thinking as a non-empty array",
    (lang) => {
      // ChatAnswer reads this with returnObjects: true and indexes into it.
      expect(Array.isArray(locales[lang].chat.thinking)).toBe(true);
      expect(locales[lang].chat.thinking.length).toBeGreaterThan(0);
    }
  );
});
