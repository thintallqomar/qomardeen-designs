-- Add `case_study` to the content_type enum so case studies live in the CMS
-- alongside articles, thinking, architecture and resources.
-- Structured case-study data (hero meta, scroll sections, gallery, metrics)
-- is stored in content_items.body_json; the Behance link reuses resource_url.
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'case_study';
