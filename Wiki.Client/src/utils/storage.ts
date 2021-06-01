import Storage from 'ayaka/localStorage';

export interface StorageState {
  isDarkTheme: boolean;
  version: string;
}

const DEFAULTS = {
  isDarkTheme: false,
  version: `1.0`
};

const s = new Storage<StorageState>('realms_UserSettings', DEFAULTS);

// Always apply latest DEFAULTS
s.upgrade((d) => ({ ...DEFAULTS, ...d }));

export default s;
