export interface RealmShardEntry {
  id: number;
  entryOrder?: number;
  fragmentId: number;
  fragmentName: string;
  fragmentCode: string;
  realmCode: string;
}

export interface RealmShard {
  id: number;
  name: string;
  code: string;
  isOrdered: boolean;
  entries: RealmShardEntry[];
}
