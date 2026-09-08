"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ingles-theme";
const EVENT = "ingles-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVENT, onStoreChange);
  };
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={() => applyTheme(dark ? "light" : "dark")}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.9 14.3A8 8 0 0 1 9.7 6.1 7 7 0 1 0 17.9 14.3Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        fill="currentColor"
        d="M12 3.2a1 1 0 0 1 1 1V5a1 1 0 1 1-2 0v-.8a1 1 0 0 1 1-1Zm0 14.8a1 1 0 0 1 1 1v.8a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1ZM5 11a1 1 0 1 1 0 2h-.8a1 1 0 1 1 0-2H5Zm14.8 0a1 1 0 1 1 0 2H19a1 1 0 1 1 0-2h.8ZM6.7 6.7a1 1 0 0 1 1.4 0l.6.6a1 1 0 1 1-1.4 1.4l-.6-.6a1 1 0 0 1 0-1.4Zm8.6 8.6a1 1 0 0 1 1.4 0l.6.6a1 1 0 1 1-1.4 1.4l-.6-.6a1 1 0 0 1 0-1.4ZM17.3 6.7a1 1 0 0 1 0 1.4l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 0 1 1.4 0Zm-8.6 8.6a1 1 0 0 1 0 1.4l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  );
}
