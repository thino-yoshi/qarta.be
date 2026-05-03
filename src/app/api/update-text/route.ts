import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Encode apostrophes to JSX entity (common in source files)
function jsxEncode(s: string) {
  return s.replace(/'/g, "&apos;");
}

// Try 4 strategies to find & replace text in a file's content
function findAndReplace(content: string, original: string, updated: string): string | null {
  const orig = original.trim();
  const upd = updated.trim();

  // 1. Exact match
  if (content.includes(orig)) {
    return content.split(orig).join(upd);
  }

  // 2. JSX-encoded apostrophes (l'app → l&apos;app)
  const encOrig = jsxEncode(orig);
  const encUpd = jsxEncode(upd);
  if (encOrig !== orig && content.includes(encOrig)) {
    return content.split(encOrig).join(encUpd);
  }

  // 3. Whitespace-collapsed regex (handles multi-line JSX text)
  //    "foo\n    bar" in source matches "foo bar" from innerText
  const parts = orig.split(/\s+/).filter(Boolean).map(escapeRegex);
  if (parts.length > 1) {
    const pattern = new RegExp(parts.join("[\\s\\S]*?"), "g");
    // safety: make sure the pattern is not too greedy
    const simplePattern = new RegExp(parts.join("\\s+"), "g");
    if (simplePattern.test(content)) {
      return content.replace(new RegExp(parts.join("\\s+"), "g"), upd);
    }
  }

  // 4. Whitespace-collapsed + JSX-encoded
  const encParts = jsxEncode(orig).split(/\s+/).filter(Boolean).map(escapeRegex);
  if (encParts.length > 1) {
    const encSimple = new RegExp(encParts.join("\\s+"), "g");
    if (encSimple.test(content)) {
      return content.replace(new RegExp(encParts.join("\\s+"), "g"), jsxEncode(upd));
    }
  }

  return null;
}

// Recursively collect all .tsx/.ts files
function walkTsx(dir: string): string[] {
  const results: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        results.push(...walkTsx(full));
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        results.push(full);
      }
    }
  } catch {}
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Sanitize: collapse newlines/multiple spaces into single space
    const original: string = (body.original ?? "").replace(/\s+/g, " ").trim();
    const updated: string  = (body.updated  ?? "").replace(/\s+/g, " ").trim();

    if (!original) return NextResponse.json({ ok: false, message: "missing" });
    if (original === updated) return NextResponse.json({ ok: false, message: "no-change" });

    // Refuse to touch files outside src/ (safety)
    const srcDir = path.join(process.cwd(), "src");

    const files = walkTsx(srcDir);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, "utf-8");
      const newContent = findAndReplace(content, original, updated);

      if (newContent !== null && newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf-8");
        return NextResponse.json({
          ok: true,
          file: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
        });
      }
    }

    return NextResponse.json({ ok: false, message: "not-found" });
  } catch (e) {
    console.error("[update-text]", e);
    return NextResponse.json({ ok: false, message: String(e) });
  }
}
