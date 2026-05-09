"use client";
import { useEffect } from "react";

/** Écoute les postMessages de l'éditeur admin et injecte les CSS vars en temps réel. */
export default function LiveThemeListener() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "QARTA_LIVE_CSS") return;
      let style = document.getElementById("qarta-live-vars") as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = "qarta-live-vars";
        document.head.appendChild(style);
      }
      style.textContent = e.data.css as string;
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
