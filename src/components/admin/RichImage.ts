import Image from '@tiptap/extension-image';

/**
 * Image node extended with alignment, width and an optional caption.
 * Renders as <figure><img/><figcaption/></figure> so published HTML is semantic.
 */
export const RichImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: el => (el as HTMLElement).getAttribute('data-align') ?? 'center',
        renderHTML: attrs => ({ 'data-align': attrs.align }),
      },
      width: {
        default: null,
        parseHTML: el => (el as HTMLElement).getAttribute('data-width'),
        renderHTML: attrs => (attrs.width ? { 'data-width': attrs.width } : {}),
      },
      caption: {
        default: null,
        parseHTML: el => (el as HTMLElement).querySelector('figcaption')?.textContent ?? null,
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [
      { tag: 'figure[data-image]' },
      { tag: 'img[src]' },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    const { align, width, caption, ...imgAttrs } = HTMLAttributes as Record<string, any>;
    const alignClass =
      align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';
    const figure: any = [
      'figure',
      { 'data-image': '', 'data-align': align ?? 'center', class: `editor-figure flex flex-col ${alignClass}` },
      ['img', { ...imgAttrs, class: 'rounded-xl', style: width ? `width:${width}` : undefined }],
    ];
    const text = node.attrs.caption as string | null;
    if (text) figure.push(['figcaption', { class: 'text-sm text-muted-foreground mt-2' }, text]);
    return figure;
  },
});

export default RichImage;
