import { create } from "zustand";

const defaultTheme = localStorage.getItem("chat-theme") || "coffee";

// Áp dụng theme từ localStorage ngay khi trang load
document.documentElement.setAttribute("data-theme", defaultTheme);

export const useThemeStore = create((set) => ({
  theme: defaultTheme,
  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    set({ theme: newTheme });
  },
}));
