"use client";

import { useEffect, useState } from "react";
import type { CookieCategoryConfig, CookieCategoryKey } from "@/lib/legal-content";

type Preferences = Record<CookieCategoryKey, boolean>;

const STORAGE_KEY = "esstofa-cookie-consent-v1";
const KEYS: CookieCategoryKey[] = ["essential", "functional", "analytics", "marketing"];

function defaultPreferences(categories: CookieCategoryConfig[]): Preferences {
  const choices = Object.fromEntries(KEYS.map((key) => [key, false])) as Preferences;
  for (const category of categories) {
    choices[category.key] = category.essential || (category.enabled && choices[category.key]);
  }
  choices.essential = true;
  return choices;
}

function readPreferences(categories: CookieCategoryConfig[]): Preferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || !("choices" in stored)) return null;
    const choices = (stored as { choices?: unknown }).choices;
    if (!choices || typeof choices !== "object") return null;

    const result = defaultPreferences(categories);
    for (const category of categories) {
      if (category.essential) {
        result[category.key] = true;
      } else if (category.enabled) {
        const choice = (choices as Record<string, unknown>)[category.key];
        result[category.key] = choice === true;
      }
    }
    return result;
  } catch (error) {
    console.error("Unable to read cookie preferences from this browser.", error);
    return null;
  }
}

export default function CookieConsent({ categories }: { categories: CookieCategoryConfig[] }) {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [hasStoredChoice, setHasStoredChoice] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(() => defaultPreferences(categories));
  const [draft, setDraft] = useState<Preferences>(() => defaultPreferences(categories));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = readPreferences(categories);
    setHasStoredChoice(saved !== null);
    if (saved) {
      setPreferences(saved);
      setDraft(saved);
    } else {
      setOpen(true);
    }

    const openSettings = () => {
      setDraft(saved ?? defaultPreferences(categories));
      setCustomizing(false);
      setErrorMessage("");
      setOpen(true);
    };
    window.addEventListener("esstofa:open-cookie-settings", openSettings);
    return () => window.removeEventListener("esstofa:open-cookie-settings", openSettings);
  }, [categories]);

  function save(next: Preferences) {
    const safe = { ...defaultPreferences(categories), ...next, essential: true };
    for (const category of categories) {
      if (!category.essential && !category.enabled) safe[category.key] = false;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        choices: safe,
        savedAt: new Date().toISOString(),
      }));
      setPreferences(safe);
      setDraft(safe);
      setHasStoredChoice(true);
      setErrorMessage("");
      setCustomizing(false);
      setOpen(false);
    } catch (error) {
      console.error("Unable to save cookie preferences in this browser.", error);
      setErrorMessage("Your preferences could not be saved in this browser. Check its storage settings and try again.");
    }
  }

  function chooseAll(accept: boolean) {
    const next = defaultPreferences(categories);
    for (const category of categories) {
      next[category.key] = category.essential || (category.enabled && accept);
    }
    save(next);
  }

  if (!open) return null;

  return (
    <aside className="cookie-consent" aria-label="Cookie preferences">
      <div className="cookie-consent-copy">
        <p className="cookie-consent-title">{customizing ? "Customize your preferences" : "Your cookie choices"}</p>
        <p>Essential storage stays on for security and site functions. Optional categories are off unless you choose otherwise.</p>
      </div>
      {customizing && (
        <fieldset className="cookie-category-options">
          <legend className="sr-only">Optional cookie categories</legend>
          {categories.map((category) => (
            <label key={category.key} className="cookie-category-option">
              <input
                type="checkbox"
                checked={category.essential || (category.enabled && draft[category.key])}
                disabled={category.essential || !category.enabled}
                onChange={(event) => setDraft((current) => ({ ...current, [category.key]: event.target.checked }))}
              />
              <span>
                <strong>{category.title}{category.essential ? " (always active)" : !category.enabled ? " (not available)" : ""}</strong>
                <small>{category.description}</small>
              </span>
            </label>
          ))}
        </fieldset>
      )}
      {errorMessage && <p className="cookie-consent-error" role="alert">{errorMessage}</p>}
      <div className="cookie-consent-actions">
        {customizing ? (
          <>
            <button type="button" className="cookie-button cookie-button-primary" onClick={() => save(draft)}>Save preferences</button>
            <button type="button" className="cookie-button" onClick={() => {
              setDraft(preferences);
              setCustomizing(false);
            }}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className="cookie-button cookie-button-primary" onClick={() => chooseAll(true)}>Accept all cookies</button>
            <button type="button" className="cookie-button" onClick={() => chooseAll(false)}>Reject non-essential</button>
            <button type="button" className="cookie-button" onClick={() => {
              setDraft(preferences);
              setCustomizing(true);
            }}>Customize preferences</button>
            {hasStoredChoice && <button type="button" className="cookie-button cookie-button-close" onClick={() => setOpen(false)}>Close</button>}
          </>
        )}
      </div>
    </aside>
  );
}
