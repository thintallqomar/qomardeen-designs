import { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextFormatGroup, ListGroup, LinkButton, HistoryGroup, ToolbarDivider } from '@/components/admin/EditorToolbarParts';

interface Props {
  /** Saved Tiptap JSON (preferred). */
  json?: unknown;
  /** Plain text used when no JSON exists yet (older content). */
  text?: string;
  onChange: (value: { json: unknown; text: string }) => void;
  placeholder?: string;
  minHeight?: string;
}

/** Turns old plain text (with line breaks) into a Tiptap document. */
const plainToDoc = (text: string) => {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  if (!paragraphs.length) return { type: 'doc', content: [{ type: 'paragraph' }] };
  return {
    type: 'doc',
    content: paragraphs.map(p => {
      const content: unknown[] = [];
      p.split('\n').forEach((line, i) => {
        if (i > 0) content.push({ type: 'hardBreak' });
        if (line) content.push({ type: 'text', text: line });
      });
      return { type: 'paragraph', content };
    }),
  };
};

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/60 px-1.5 py-1">
    <TextFormatGroup editor={editor} />
    <ToolbarDivider />
    <ListGroup editor={editor} />
    <LinkButton editor={editor} />
    <ToolbarDivider />
    <HistoryGroup editor={editor} />
  </div>
);

/**
 * Compact rich-text field for long descriptions (bold, italic, lists, quote, link).
 * Stores Tiptap JSON plus a plain-text copy (used for search, reading time, fallbacks).
 */
const RichTextField = ({ json, text = '', onChange, placeholder = 'Write here…', minHeight = '8rem' }: Props) => {
  const initial = (json as object | undefined) ?? plainToDoc(text);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initial as never,
    editorProps: {
      attributes: {
        class: 'rich-text focus:outline-none px-3 py-2.5 text-sm',
        style: `min-height:${minHeight}`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange({ json: ed.getJSON(), text: ed.getText({ blockSeparator: '\n\n' }) });
    },
  });

  // Keep the editor in step when the section moves or is deleted (React reuses this instance
  // for a different section). Typing never triggers this: the editor's own JSON already matches.
  useEffect(() => {
    if (!editor) return;
    const incoming = (json as object | undefined) ?? plainToDoc(text);
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(incoming)) {
      editor.commands.setContent(incoming as never, { emitUpdate: false });
    }
  }, [editor, json, text]);

  if (!editor) return <div className="rounded-xl border border-border bg-secondary" style={{ minHeight }} />;

  return (
    <div className="rich-text-editor rounded-xl border border-border bg-secondary overflow-hidden focus-within:ring-1 focus-within:ring-primary">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextField;
