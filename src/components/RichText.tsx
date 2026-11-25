import type { ReactNode } from 'react';
import { safeHref, safeSrc } from '@/lib/safeUrl';
import { ARTICLE_PROSE } from '@/lib/proseClasses';

/**
 * Renders Tiptap/ProseMirror JSON as React elements.
 * Only a fixed whitelist of nodes and marks is rendered, and no raw HTML is ever
 * injected, so content from the admin editors cannot introduce scripts or markup.
 */

interface PMMark { type: string; attrs?: Record<string, unknown> }
interface PMNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: PMMark[];
  content?: PMNode[];
}


const safeWidth = (w: unknown): string | undefined =>
  typeof w === 'string' && /^\d{1,4}(px|%)$/.test(w.trim()) ? w.trim() : undefined;

const num = (n: unknown): number | undefined => (typeof n === 'number' && n > 0 && n < 50 ? n : undefined);

const applyMarks = (text: string, marks: PMMark[] | undefined, key: string): ReactNode => {
  let out: ReactNode = text;
  (marks ?? []).forEach((m, i) => {
    const k = `${key}-m${i}`;
    switch (m.type) {
      case 'bold': out = <strong key={k}>{out}</strong>; break;
      case 'italic': out = <em key={k}>{out}</em>; break;
      case 'underline': out = <u key={k}>{out}</u>; break;
      case 'strike': out = <s key={k}>{out}</s>; break;
      case 'code': out = <code key={k}>{out}</code>; break;
      case 'link': {
        const href = safeHref(m.attrs?.href);
        if (href) out = <a key={k} href={href} target="_blank" rel="noopener noreferrer nofollow">{out}</a>;
        break;
      }
      default: break;
    }
  });
  return out;
};

const renderChildren = (nodes: PMNode[] | undefined, key: string): ReactNode[] =>
  (nodes ?? []).map((n, i) => renderNode(n, `${key}-${i}`));

const plainText = (node: PMNode): string =>
  node.type === 'text' ? node.text ?? '' : (node.content ?? []).map(plainText).join('');

const renderNode = (node: PMNode, key: string): ReactNode => {
  switch (node.type) {
    case 'text': return applyMarks(node.text ?? '', node.marks, key);
    case 'hardBreak': return <br key={key} />;
    case 'paragraph': return <p key={key}>{renderChildren(node.content, key)}</p>;
    case 'heading': {
      const level = Math.min(4, Math.max(2, Number(node.attrs?.level) || 2));
      const Tag = (`h${level}`) as 'h2' | 'h3' | 'h4';
      return <Tag key={key}>{renderChildren(node.content, key)}</Tag>;
    }
    case 'bulletList': return <ul key={key}>{renderChildren(node.content, key)}</ul>;
    case 'orderedList': return <ol key={key}>{renderChildren(node.content, key)}</ol>;
    case 'listItem': return <li key={key}>{renderChildren(node.content, key)}</li>;
    case 'blockquote': return <blockquote key={key}>{renderChildren(node.content, key)}</blockquote>;
    case 'codeBlock': return <pre key={key}><code>{plainText(node)}</code></pre>;
    case 'horizontalRule': return <hr key={key} />;
    case 'image': {
      const src = safeSrc(node.attrs?.src);
      if (!src) return null;
      const align = node.attrs?.align;
      const alignClass = align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center';
      const width = safeWidth(node.attrs?.width);
      const caption = typeof node.attrs?.caption === 'string' ? node.attrs.caption : '';
      return (
        <figure key={key} className={`flex flex-col ${alignClass}`}>
          <img
            src={src}
            alt={typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''}
            loading="lazy"
            decoding="async"
            style={width ? { width } : undefined}
          />
          {caption && <figcaption className="text-sm text-muted-foreground mt-2">{caption}</figcaption>}
        </figure>
      );
    }
    case 'table': return <div key={key} className="overflow-x-auto"><table><tbody>{renderChildren(node.content, key)}</tbody></table></div>;
    case 'tableRow': return <tr key={key}>{renderChildren(node.content, key)}</tr>;
    case 'tableHeader': return <th key={key} colSpan={num(node.attrs?.colspan)} rowSpan={num(node.attrs?.rowspan)}>{renderChildren(node.content, key)}</th>;
    case 'tableCell': return <td key={key} colSpan={num(node.attrs?.colspan)} rowSpan={num(node.attrs?.rowspan)}>{renderChildren(node.content, key)}</td>;
    default: return <span key={key}>{renderChildren(node.content, key)}</span>;
  }
};

const hasText = (node: PMNode | undefined): boolean => {
  if (!node) return false;
  if (node.type === 'text') return !!node.text?.trim();
  if (node.type === 'image' || node.type === 'horizontalRule' || node.type === 'table') return true;
  return (node.content ?? []).some(hasText);
};

/** True when a saved Tiptap document has something to show (text, an image, a table...). */
export const hasRenderableContent = (json: unknown): boolean => {
  const doc = json as PMNode | undefined;
  return !!doc && doc.type === 'doc' && hasText(doc);
};

interface Props {
  /** Tiptap JSON document. When missing or empty, `fallback` is shown instead. */
  json?: unknown;
  /** Plain-text fallback for content written before rich text existed. */
  fallback?: string;
  className?: string;
  /** 'article' = long-form look shared with the article editor (headings, tables, images...). */
  variant?: 'inline' | 'article';
}

const RichText = ({ json, fallback = '', className = '', variant = 'inline' }: Props) => {
  const doc = json as PMNode | undefined;
  if (hasRenderableContent(doc)) {
    const base = variant === 'article' ? ARTICLE_PROSE : 'rich-text';
    return <div className={`${base} ${className}`}>{renderChildren(doc!.content, 'rt')}</div>;
  }
  if (!fallback.trim()) return null;
  return <p className={`whitespace-pre-line ${className}`}>{fallback}</p>;
};

export default RichText;
