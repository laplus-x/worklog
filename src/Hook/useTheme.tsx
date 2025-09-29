import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cs = document?.documentElement.style.colorScheme;
    return cs === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;

    const observer = new MutationObserver(() => {
      const cs = html.style.colorScheme;
      setTheme(cs === "dark" ? "dark" : "light");
    });

    observer.observe(html, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);

  return { theme };
};
