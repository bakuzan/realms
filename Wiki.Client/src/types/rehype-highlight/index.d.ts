declare module 'rehype-highlight' {
  import u from 'unified';

  type RehypeHighlightPlugin = u.Pluggable;

  const rehypeHighlight: RehypeHighlightPlugin;

  export = rehypeHighlight;
}
