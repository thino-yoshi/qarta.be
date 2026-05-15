import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const BUCKET   = "card-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  /* ── Auth ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  /* ── Validation fichier ── */
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!file.type.startsWith("image/"))
    return NextResponse.json({ error: "Type invalide — image uniquement" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Fichier trop grand (max 5 MB)" }, { status: 400 });

  const admin = createAdminClient();

  /* ── Créer le bucket si nécessaire ── */
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error: bucketErr } = await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_SIZE,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (bucketErr) {
      console.error("[upload-image] createBucket", bucketErr);
      return NextResponse.json({ error: bucketErr.message }, { status: 500 });
    }
  }

  /* ── Upload ── */
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;
  const buf  = await file.arrayBuffer();

  const { error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: file.type, upsert: true });

  if (uploadErr) {
    console.error("[upload-image] upload", uploadErr);
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  /* ── URL publique ── */
  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
