import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, List, ListOrdered, Quote, Link2,
  Undo2, Redo2, RemoveFormatting,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';

/**
 * Toolbar pieces shared by every rich-text editor in the admin (case-study descriptions,
 * articles, blogs, thinking, architecture, resources), so they all look and behave the same.
 */

export const ToolbarButton = ({
  label, active, disabled, onClick, children,
}: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) => (
  <IconTooltip label={label} side="bottom">
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // keep focus (and the text selection) in the editor when a toolbar button is pressed
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors disabled:opacity-30 ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  </IconTooltip>
);

export const ToolbarDivider = () => <span className="w-px h-4 bg-border mx-1" aria-hidden="true" />;

export function promptForLink(editor: Editor) {
  const previous = editor.getAttributes('link').href as string | undefined;
  const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://');
  if (url === null) return;
  if (url.trim() === '') return void editor.chain().focus().extendMarkRange('link').unsetLink().run();
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(url.trim())) {
    window.alert('Links must start with https://, http://, mailto: or tel:');
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
}

const icon = 'w-4 h-4';

/** Bold, italic, underline, strikethrough (and optionally inline code). */
export const TextFormatGroup = ({ editor, withCode = false }: { editor: Editor; withCode?: boolean }) => (
  <>
    <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className={icon} /></ToolbarButton>
    <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className={icon} /></ToolbarButton>
    <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className={icon} /></ToolbarButton>
    <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className={icon} /></ToolbarButton>
    {withCode && (
      <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className={icon} /></ToolbarButton>
    )}
  </>
);

/** Bullet list, numbered list, quote. */
export const ListGroup = ({ editor }: { editor: Editor }) => (
  <>
    <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className={icon} /></ToolbarButton>
    <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className={icon} /></ToolbarButton>
    <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className={icon} /></ToolbarButton>
  </>
);

export const LinkButton = ({ editor }: { editor: Editor }) => (
  <ToolbarButton label="Link" active={editor.isActive('link')} onClick={() => promptForLink(editor)}><Link2 className={icon} /></ToolbarButton>
);

/** Clear formatting, undo, redo. */
export const HistoryGroup = ({ editor }: { editor: Editor }) => (
  <>
    <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting className={icon} /></ToolbarButton>
    <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className={icon} /></ToolbarButton>
    <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className={icon} /></ToolbarButton>
  </>
);
