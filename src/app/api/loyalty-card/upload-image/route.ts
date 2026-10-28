import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET     = process.env.R2_BUCKET     ?? "qarta-storage";
const PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";
const MAX_SIZE   = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file)
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!file.type.startsWith("image/"))
    return NextResponse.json({ error: "Type invalide — image uniquement" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Fichier trop grand (max 5 MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `card-images/${user.id}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await R2.send(new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buf,
      ContentType: file.type,
    }));
  } catch (err) {
    console.error("[upload-image] R2:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ url: `${PUBLIC_URL}/${key}` });
}
