import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RichText from '@/components/RichText';

const doc = (content: unknown[]) => ({ type: 'doc', content });
const p = (...c: unknown[]) => ({ type: 'paragraph', content: c });
const t = (text: string, marks?: unknown[]) => ({ type: 'text', text, ...(marks ? { marks } : {}) });
const render = (props: Record<string, unknown>) => renderToStaticMarkup(createElement(RichText, props));

describe('RichText renderer', () => {
  it('renders bold, italic and lists', () => {
    const html = render({
      json: doc([
        p(t('Hello ', [{ type: 'bold' }]), t('world', [{ type: 'italic' }])),
        { type: 'bulletList', content: [{ type: 'listItem', content: [p(t('one'))] }, { type: 'listItem', content: [p(t('two'))] }] },
        { type: 'orderedList', content: [{ type: 'listItem', content: [p(t('first'))] }] },
      ]),
    });
    expect(html).toContain('<strong>Hello </strong>');
    expect(html).toContain('<em>world</em>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<ol>');
    expect(html).toContain('<li><p>one</p></li>');
  });

  it('never renders unsafe links or raw HTML', () => {
    const html = render({
      json: doc([p(
        t('click', [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }]),
        t('<script>alert(1)</script>'),
      )]),
    });
    expect(html).not.toContain('href=');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('keeps https links and opens them safely', () => {
    const html = render({ json: doc([p(t('site', [{ type: 'link', attrs: { href: 'https://example.com' } }]))]) });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
  });

  it('falls back to old plain text and keeps line breaks', () => {
    const html = render({ fallback: 'Line one\nLine two', className: 'x' });
    expect(html).toContain('whitespace-pre-line');
    expect(html).toContain('Line one\nLine two');
  });

  it('renders nothing when both are empty', () => {
    expect(render({ json: doc([p()]), fallback: '' })).toBe('');
  });
});
