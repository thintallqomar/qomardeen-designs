import { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered,
  Quote, Link2, Undo2, Redo2, RemoveFormatting,
} from 'lucide-react';

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

const Btn = ({
  label, active, disabled, onClick, children,
}: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    // keep focus (and the text selection) in the editor when a toolbar button is pressed
    onMouseDown={e => e.preventDefault()}
    onClick={onClick}
    className={`p-1.5 rounded-md transition-colors disabled:opacity-30 ${
      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-background hover:text-foreground'
    }`}
  >
    {children}
  </button>
);

const Toolbar = ({ editor }: { editor: Editor }) => {
  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') return void editor.chain().focus().extendMarkRange('link').unsetLink().run();
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(url.trim())) {
      window.alert('Links must start with https://, http://, mailto: or tel:');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/60 px-1.5 py-1">
      <Btn label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
      <Btn label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
      <Btn label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
      <Btn label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
      <span className="w-px h-4 bg-border mx-1" aria-hidden="true" />
      <Btn label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
      <Btn label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
      <Btn label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
      <Btn label="Link" active={editor.isActive('link')} onClick={setLink}><Link2 className="w-4 h-4" /></Btn>
      <span className="w-px h-4 bg-border mx-1" aria-hidden="true" />
      <Btn label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting className="w-4 h-4" /></Btn>
      <Btn label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
      <Btn label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
    </div>
  );
};

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
                class: 'rich-text focus:outline-none px-3 py-2.5 text-sm [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:list-item',
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
