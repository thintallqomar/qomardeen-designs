import { describe, expect, it } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

/** Anonymous (signed-out) client — exactly what a random visitor gets. */
const anon = createClient(url, key, { auth: { persistSession: false } });

const denied = (error: unknown, data: unknown) =>
  !!error || (Array.isArray(data) && data.length === 0);

describe('RLS: anonymous visitors cannot publish', () => {
  it('blocks anon inserts into content_items', async () => {
    const { error } = await anon.from('content_items').insert({
      type: 'article', title: 'rls probe', slug: `rls-probe-${Date.now()}`, status: 'published',
    } as never);
    expect(error).toBeTruthy();
  });

  it('blocks anon updates that would publish existing content', async () => {
    const { error, data } = await anon
      .from('content_items')
      .update({ status: 'published' } as never)
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');
    expect(denied(error, data)).toBe(true);
  });

  it('blocks anon deletes of content', async () => {
    const { error, data } = await anon
      .from('content_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');
    expect(denied(error, data)).toBe(true);
  });

  it('blocks anon inserts into ai_blog_posts', async () => {
    const { error } = await anon.from('ai_blog_posts').insert({
      title: 'rls probe', slug: `rls-probe-${Date.now()}`, content: 'x', excerpt: 'x', status: 'published',
    } as never);
    expect(error).toBeTruthy();
  });

  it('only ever exposes published, public content to anon reads', async () => {
    const { data, error } = await anon.from('content_items').select('status, visibility');
    expect(error).toBeFalsy();
    for (const row of data ?? []) {
      expect(row.status).toBe('published');
      expect(row.visibility).toBe('public');
    }
  });
});

describe('RLS: privileged data stays private', () => {
  it('never exposes guest commenter emails', async () => {
    const direct = await anon.from('blog_comments').select('guest_email');
    expect(direct.error).toBeTruthy();

    const contacts = await anon.from('comment_contacts' as never).select('email');
    expect(denied(contacts.error, contacts.data)).toBe(true);

    const view = await anon.from('blog_comments_public' as never).select('*').limit(1);
    expect(view.error).toBeFalsy();
    for (const row of (view.data as Record<string, unknown>[]) ?? []) {
      expect(Object.keys(row)).not.toContain('guest_email');
    }
  });

  it('does not let anon read or grant roles', async () => {
    const read = await anon.from('user_roles').select('*');
    expect(denied(read.error, read.data)).toBe(true);

    const escalate = await anon.from('user_roles').insert({
      user_id: '00000000-0000-0000-0000-000000000000', role: 'admin',
    } as never);
    expect(escalate.error).toBeTruthy();
  });

  it('keeps the audit log unreadable and unforgeable for anon', async () => {
    const read = await anon.from('audit_log').select('*');
    expect(denied(read.error, read.data)).toBe(true);

    const write = await anon.from('audit_log').insert({ event_type: 'forged' } as never);
    expect(write.error).toBeTruthy();
  });
});
