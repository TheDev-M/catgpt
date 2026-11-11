import { describe, expect, it } from "vitest";
import { validateCatName } from "./validation.js";

const currentCat = { id: 1, name: "Bob" };
const noDuplicates = () => false;

describe("validateCatName", () => {
  it("accepts a plain name", () => {
    expect(validateCatName("Luna", currentCat, noDuplicates)).toBeNull();
  });

  it.each(["Bögre", "Müller", "José", "Ñuño"])(
    "accepts non-English letters: %s",
    (name) => {
      expect(validateCatName(name, currentCat, noDuplicates)).toBeNull();
    }
  );

  it("rejects an empty name", () => {
    expect(validateCatName("   ", currentCat, noDuplicates))
      .toEqual({ key: "validation.nameRequired" });
  });

  it("rejects a name that does not start with a letter", () => {
    expect(validateCatName("1Luna", currentCat, noDuplicates))
      .toEqual({ key: "validation.nameInvalid" });
  });

  it("rejects punctuation", () => {
    expect(validateCatName("Luna!", currentCat, noDuplicates))
      .toEqual({ key: "validation.nameInvalid" });
  });

  it("rejects a name shorter than three characters", () => {
    expect(validateCatName("Lu", currentCat, noDuplicates))
      .toEqual({ key: "validation.nameTooShort" });
  });

  it("rejects a name longer than sixteen characters", () => {
    expect(validateCatName("a".repeat(17), currentCat, noDuplicates))
      .toEqual({ key: "validation.nameTooLong" });
  });

  it("reports a duplicate with the offending name", () => {
    expect(validateCatName("Luna", currentCat, () => true))
      .toEqual({ key: "validation.nameDuplicate", options: { name: "Luna" } });
  });

  it("allows renaming a cat to its own name in a different case", () => {
    expect(validateCatName("bob", currentCat, () => true)).toBeNull();
  });
});
