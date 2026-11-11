import type { ReactNode } from 'react';

/**
 * Renders Tiptap/ProseMirror JSON as React elements.
 * Only a fixed whitelist of nodes and marks is rendered, and no raw HTML is ever
 * injected, so content from the admin editor cannot introduce scripts or markup.
 */

interface PMMark { type: string; attrs?: Record<string, unknown> }
interface PMNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: PMMark[];
  content?: PMNode[];
}

const safeHref = (href: unknown): string | undefined =>
  typeof href === 'string' && /^(https?:\/\/|mailto:|tel:|\/)/i.test(href.trim()) ? href.trim() : undefined;

const applyMarks = (text: string, marks: PMMark[] | undefined, key: string): ReactNode => {
  let out: ReactNode = text;
  (marks ?? []).forEach((m, i) => {
    const k = `${key}-m${i}`;
    switch (m.type) {
      case 'bold': out = <strong key={k}>{out}</strong>; break;
      case 'italic': out = <em key={k}>{out}</em>; break;
      case 'underline': out = <u key={k}>{out}</u>; break;
      case 'strike': out = <s key={k}>{out}</s>; break;
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

const renderNode = (node: PMNode, key: string): ReactNode => {
  switch (node.type) {
    case 'text': return applyMarks(node.text ?? '', node.marks, key);
    case 'hardBreak': return <br key={key} />;
    case 'paragraph': return <p key={key}>{renderChildren(node.content, key)}</p>;
    case 'bulletList': return <ul key={key}>{renderChildren(node.content, key)}</ul>;
    case 'orderedList': return <ol key={key}>{renderChildren(node.content, key)}</ol>;
    case 'listItem': return <li key={key}>{renderChildren(node.content, key)}</li>;
    case 'blockquote': return <blockquote key={key}>{renderChildren(node.content, key)}</blockquote>;
    default: return <span key={key}>{renderChildren(node.content, key)}</span>;
  }
};

const hasText = (node: PMNode | undefined): boolean => {
  if (!node) return false;
  if (node.type === 'text') return !!node.text?.trim();
  return (node.content ?? []).some(hasText);
};

interface Props {
  /** Tiptap JSON document. When missing or empty, `fallback` is shown instead. */
  json?: unknown;
  /** Plain-text fallback for content written before rich text existed. */
  fallback?: string;
  className?: string;
}

const RichText = ({ json, fallback = '', className = '' }: Props) => {
  const doc = json as PMNode | undefined;
  if (doc && doc.type === 'doc' && hasText(doc)) {
    return <div className={`rich-text ${className}`}>{renderChildren(doc.content, 'rt')}</div>;
  }
  if (!fallback.trim()) return null;
  return <p className={`whitespace-pre-line ${className}`}>{fallback}</p>;
};

export default RichText;
