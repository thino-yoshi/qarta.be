import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SECTION_DEFS, getDefaults } from "./sections";

/** Fetches all sections for a page and merges with defaults. Server-side only.
 *  Wrapped with React cache() to deduplicate calls within one render (e.g. page + generateMetadata). */
export const getPageContent = cache(async function getPageContent(page: string): Promise<Record<string, Record<string, unknown>>> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("page_content")
      .select("section, content")
      .eq("page", page);

    const dbMap: Record<string, Record<string, unknown>> = {};
    for (const row of data ?? []) {
      dbMap[row.section] = row.content as Record<string, unknown>;
    }

    // Merge each section's DB content with defaults
    const result: Record<string, Record<string, unknown>> = {};
    for (const def of SECTION_DEFS.filter(s => s.page === page)) {
      result[def.id] = { ...getDefaults(def), ...(dbMap[def.id] ?? {}) };
    }

    return result;
  } catch {
    // Graceful fallback — return all defaults if DB unreachable
    const result: Record<string, Record<string, unknown>> = {};
    for (const def of SECTION_DEFS.filter(s => s.page === page)) {
      result[def.id] = getDefaults(def);
    }
    return result;
  }
});
