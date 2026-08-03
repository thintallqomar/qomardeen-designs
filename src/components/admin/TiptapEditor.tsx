import { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import RichImage from './RichImage';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  Bold, Italic, Strikethrough, Code, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Undo2, Redo2, Link2, ImagePlus, Table2, Code2,
  AlignLeft, AlignCenter, AlignRight, Captions, Maximize2,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';
import { uploadMedia } from '@/lib/media';
import { toast } from 'sonner';

interface Props {
  content: unknown;
  onChange: (payload: { json: unknown; html: string; text: string }) => void;
  onRequestImage?: (insert: (url: string, alt?: string) => void) => void;
}

const Btn = ({
  label, active, onClick, children,
}: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <IconTooltip label={label} side="bottom">
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-lg transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      {children}
    </button>
  </IconTooltip>
);

const Toolbar = ({ editor, onRequestImage }: { editor: Editor; onRequestImage?: Props['onRequestImage'] }) => {
  const insertImage = () => {
    const apply = (url: string, alt?: string) => editor.chain().focus().setImage({ src: url, alt }).run();
    if (onRequestImage) return onRequestImage(apply);
    const url = window.prompt('Image URL');
    if (url) apply(url);
  };

  const imageActive = editor.isActive('image');
  const setImageAttrs = (attrs: Record<string, unknown>) =>
    editor.chain().focus().updateAttributes('image', attrs).run();
  const setCaption = () => {
    const current = (editor.getAttributes('image').caption as string) ?? '';
    const caption = window.prompt('Caption', current);
    if (caption === null) return;
    setImageAttrs({ caption: caption || null });
  };
  const setWidth = () => {
    const current = (editor.getAttributes('image').width as string) ?? '100%';
    const width = window.prompt('Width (e.g. 100%, 60%, 480px)', current);
    if (width === null) return;
    setImageAttrs({ width: width || null });
  };

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');
    if (url === null) return;
    if (url === '') return editor.chain().focus().unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 sticky top-14 bg-background/95 backdrop-blur z-10">
      <Btn label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
      <Btn label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
      <Btn label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
      <Btn label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="w-4 h-4" /></Btn>
      <div className="w-px h-5 bg-border mx-1" />
      <Btn label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
      <Btn label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
      <Btn label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
      <Btn label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
      <Btn label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
      <Btn label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="w-4 h-4" /></Btn>
      <Btn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
      <div className="w-px h-5 bg-border mx-1" />
      <Btn label="Insert link" active={editor.isActive('link')} onClick={setLink}><Link2 className="w-4 h-4" /></Btn>
      <Btn label="Insert image" onClick={insertImage}><ImagePlus className="w-4 h-4" /></Btn>
      <Btn label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className="w-4 h-4" /></Btn>
      {imageActive && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <Btn label="Align image left" onClick={() => setImageAttrs({ align: 'left' })}><AlignLeft className="w-4 h-4" /></Btn>
          <Btn label="Align image center" onClick={() => setImageAttrs({ align: 'center' })}><AlignCenter className="w-4 h-4" /></Btn>
          <Btn label="Align image right" onClick={() => setImageAttrs({ align: 'right' })}><AlignRight className="w-4 h-4" /></Btn>
          <Btn label="Image caption" onClick={setCaption}><Captions className="w-4 h-4" /></Btn>
          <Btn label="Image width" onClick={setWidth}><Maximize2 className="w-4 h-4" /></Btn>
        </>
      )}
      <div className="w-px h-5 bg-border mx-1" />
      <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
      <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
    </div>
  );
};

const TiptapEditor = ({ content, onChange, onRequestImage }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      RichImage.configure({ HTMLAttributes: { class: 'rounded-xl' } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Tell the story…' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (content as any) ?? '',
    editorProps: {
      attributes: {
        class: 'article-content focus:outline-none min-h-[50vh] px-1 py-6',
      },
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'));
        if (!files.length) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
        if (!files.length) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML(), text: editor.getText() });
    },
  });

  async function uploadFiles(files: File[]) {
    for (const file of files) {
      const toastId = toast.loading(`Uploading ${file.name}…`);
      try {
        const asset = await uploadMedia(file, 'content');
        editor?.chain().focus().setImage({ src: asset.public_url, alt: asset.alt_text ?? asset.file_name }).run();
        toast.success('Image added', { id: toastId });
      } catch (e: any) {
        toast.error(e.message ?? 'Upload failed', { id: toastId });
      }
    }
  }

  // Load content when an existing item finishes fetching.
  useEffect(() => {
    if (!editor || !content) return;
    if (JSON.stringify(editor.getJSON()) === JSON.stringify(content)) return;
    editor.commands.setContent(content as any, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <Toolbar editor={editor} onRequestImage={onRequestImage} />
      <div className="px-5 md:px-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;