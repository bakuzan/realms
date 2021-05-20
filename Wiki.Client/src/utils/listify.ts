type ListFormatOptions = {
  type?: 'conjunction' | 'disjunction' | 'unit';
  style?: 'long' | 'short' | 'narrow';
  localeMatcher?: 'lookup' | 'best fit';
};

declare namespace Intl {
  class ListFormat {
    constructor(locale: string, options: ListFormatOptions);
    public format: (items: Array<string>) => string;
  }
}

type ListifyOptions<ItemType> = {
  type?: ListFormatOptions['type'];
  style?: ListFormatOptions['style'];
  stringify?: (item: ItemType) => string;
};

export default function listify<ItemType>(
  array: Array<ItemType>,
  {
    type = 'conjunction',
    style = 'long',
    stringify = (thing: { toString(): string }) => thing.toString()
  }: ListifyOptions<ItemType> = {}
) {
  const stringified = array.map((item) => stringify(item));
  const formatter = new Intl.ListFormat('en', { style, type });
  return formatter.format(stringified);
}
