import { ChipListOption } from 'meiko/ChipListInput';

import { Tag, TagInput } from 'src/interfaces/Tag';

type TagLike = Tag | TagInput;

export function mapTagToChipListOption(x: TagLike): ChipListOption {
  return { id: x.code, name: x.name };
}
