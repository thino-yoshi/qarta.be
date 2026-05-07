-- Table de contenu des pages (éditeur admin)
CREATE TABLE IF NOT EXISTS page_content (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  page        text        NOT NULL,          -- 'home' | 'login' | 'register' | 'dashboard'
  section     text        NOT NULL,          -- 'header' | 'hero' | 'cta' | 'footer' | ...
  content     jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(page, section)
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Aucun accès public — uniquement via service role (API admin)
CREATE POLICY "no_public_access" ON page_content
  FOR ALL USING (false);
