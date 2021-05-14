import { RealmShard } from 'src/interfaces/RealmShard';

export default function groupEditorValidator(shard: RealmShard) {
  const errors = new Map<string, string>([]);

  if (!shard.name || !shard.name.trim()) {
    errors.set('name', 'Name is required');
  }

  // todo
  // consider checking if the shard has any fragments

  return errors;
}
