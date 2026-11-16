import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  Heading2, Heading3, Code2, Minus, ImagePlus, Table2, AlignLeft, AlignCenter, AlignRight, Captions, Maximize2,
} from 'lucide-react';
import { toast } from 'sonner';
import RichImage from './RichImage';
import { uploadMedia } from '@/lib/media';
import { ARTICLE_PROSE } from '@/lib/proseClasses';
import {
  TextFormatGroup, ListGroup, LinkButton, HistoryGroup, ToolbarButton, ToolbarDivider,
} from '@/components/admin/EditorToolbarParts';

export interface RichTextValue {
  json: unknown;
  html: string;
  text: string;
}

interface Props {
  /** Saved Tiptap JSON (preferred). */
  json?: unknown;
  /** Saved HTML, used only for older content that has no JSON. */
  html?: string;
  /** Plain text, used only for older content that has neither. */
  text?: string;
  onChange: (value: RichTextValue) => void;
  placeholder?: string;
  minHeight?: string;
  /**
   * 'compact' = short descriptions (case-study sections).
   * 'article' = long-form writing: adds headings, code, divider, images and tables.
   */
  variant?: 'compact' | 'article';
  /** Article variant: open the media library, then call insert(url, alt). */
  onRequestImage?: (insert: (url: string, alt?: string) => void) => void;
}

const isDoc = (j: unknown): j is object => !!j && typeof j === 'object' && (j as { type?: string }).type === 'doc';

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

const initialContent = (json: unknown, html: string | undefined, text: string | undefined): object | string =>
  isDoc(json) ? json : html && html.trim() ? html : plainToDoc(text ?? '');

const Toolbar = ({
  editor, variant, onRequestImage,
}: { editor: Editor; variant: 'compact' | 'article'; onRequestImage?: Props['onRequestImage'] }) => {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/60 px-1.5 py-1">
        <TextFormatGroup editor={editor} />
        <ToolbarDivider />
        <ListGroup editor={editor} />
        <LinkButton editor={editor} />
        <ToolbarDivider />
        <HistoryGroup editor={editor} />
      </div>
    );
  }

  const insertImage = () => {
    const apply = (url: string, alt?: string) => editor.chain().focus().setImage({ src: url, alt }).run();
    if (onRequestImage) return onRequestImage(apply);
    const url = window.prompt('Image URL');
    if (url) apply(url);
  };
  const imageActive = editor.isActive('image');
  const setImageAttrs = (attrs: Record<string, unknown>) => editor.chain().focus().updateAttributes('image', attrs).run();
  const setCaption = () => {
    const caption = window.prompt('Caption', (editor.getAttributes('image').caption as string) ?? '');
    if (caption !== null) setImageAttrs({ caption: caption || null });
  };
  const setWidth = () => {
    const width = window.prompt('Width (e.g. 100%, 60%, 480px)', (editor.getAttributes('image').width as string) ?? '100%');
    if (width !== null) setImageAttrs({ width: width || null });
  };
  const i = 'w-4 h-4';

  return (
    // Sticks just under the admin header while you scroll a long article (and stays in place otherwise).
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 sticky top-14 z-20 rounded-t-2xl bg-background/95 backdrop-blur">
      <TextFormatGroup editor={editor} withCode />
      <ToolbarDivider />
      <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className={i} /></ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className={i} /></ToolbarButton>
      <ListGroup editor={editor} />
      <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className={i} /></ToolbarButton>
      <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className={i} /></ToolbarButton>
      <ToolbarDivider />
      <LinkButton editor={editor} />
      <ToolbarButton label="Insert image" onClick={insertImage}><ImagePlus className={i} /></ToolbarButton>
      <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className={i} /></ToolbarButton>
      {imageActive && (
        <>
          <ToolbarDivider />
          <ToolbarButton label="Align image left" onClick={() => setImageAttrs({ align: 'left' })}><AlignLeft className={i} /></ToolbarButton>
          <ToolbarButton label="Align image center" onClick={() => setImageAttrs({ align: 'center' })}><AlignCenter className={i} /></ToolbarButton>
          <ToolbarButton label="Align image right" onClick={() => setImageAttrs({ align: 'right' })}><AlignRight className={i} /></ToolbarButton>
          <ToolbarButton label="Image caption" onClick={setCaption}><Captions className={i} /></ToolbarButton>
          <ToolbarButton label="Image width" onClick={setWidth}><Maximize2 className={i} /></ToolbarButton>
        </>
      )}
      <ToolbarDivider />
      <HistoryGroup editor={editor} />
    </div>
  );
};

/**
 * THE rich-text editor for the whole admin (case-study descriptions, articles, blogs, thinking,
 * architecture, resources). Stores Tiptap JSON plus HTML and a plain-text copy.
 */
const RichTextField = ({
  json, html, text = '', onChange, placeholder = 'Write here…', minHeight, variant = 'compact', onRequestImage,
}: Props) => {
  const article = variant === 'article';
  const editorRef = useRef<Editor | null>(null);

  async function uploadFiles(files: File[]) {
    for (const file of files) {
      const toastId = toast.loading(`Uploading ${file.name}…`);
      try {
        const asset = await uploadMedia(file, 'content');
        editorRef.current?.chain().focus().setImage({ src: asset.public_url, alt: asset.alt_text ?? asset.file_name }).run();
        toast.success('Image added', { id: toastId });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Upload failed', { id: toastId });
      }
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure(
        article
          ? { heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } } }
          : { heading: false, codeBlock: false, code: false, horizontalRule: false, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } } },
      ),
      Placeholder.configure({ placeholder }),
      ...(article ? [RichImage.configure({ HTMLAttributes: { class: 'rounded-xl' } }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell] : []),
    ],
    content: initialContent(json, html, text) as never,
    editorProps: {
      attributes: {
        class: article
          ? `${ARTICLE_PROSE} focus:outline-none px-5 py-6`
          : 'rich-text focus:outline-none px-3 py-2.5 text-sm',
        style: `min-height:${minHeight ?? (article ? '55vh' : '8rem')}`,
      },
      ...(article
        ? {
            handlePaste: (_view: unknown, event: ClipboardEvent) => {
              const files = Array.from(event.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'));
              if (!files.length) return false;
              event.preventDefault();
              void uploadFiles(files);
              return true;
            },
            handleDrop: (_view: unknown, event: DragEvent) => {
              const files = Array.from(event.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
              if (!files.length) return false;
              event.preventDefault();
              void uploadFiles(files);
              return true;
            },
          }
        : {}),
    },
    onUpdate: ({ editor: ed }) => {
      onChange({ json: ed.getJSON(), html: ed.getHTML(), text: ed.getText({ blockSeparator: '\n\n' }) });
    },
  });
  editorRef.current = editor;

  // Keep the editor in step when saved content arrives later (an existing article finishes loading) or when a
  // section moves/deletes (React reuses this instance for a different section). Typing never triggers this:
  // the editor's own JSON already matches what the parent holds.
  useEffect(() => {
    if (!editor) return;
    const incoming = initialContent(json, html, text);
    if (typeof incoming === 'string') {
      if (editor.isEmpty && editor.getHTML() !== incoming) editor.commands.setContent(incoming, { emitUpdate: false });
      return;
    }
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(incoming)) {
      editor.commands.setContent(incoming as never, { emitUpdate: false });
    }
  }, [editor, json, html, text]);

  if (!editor) return <div className="rounded-xl border border-border bg-secondary" style={{ minHeight: minHeight ?? '8rem' }} />;

  return (
    <div
      className={`rich-text-editor border border-border focus-within:ring-1 focus-within:ring-primary ${
        article ? 'rounded-2xl bg-background' : 'rounded-xl bg-secondary overflow-hidden'
      }`}
    >
      <Toolbar editor={editor} variant={variant} onRequestImage={onRequestImage} />
      {/* Clicking anywhere in the writing area puts the cursor in the text. */}
      <div
        className="cursor-text"
        onMouseDown={e => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            editor.chain().focus('end').run();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextField;
