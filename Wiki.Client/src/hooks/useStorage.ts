import { useCallback, useState } from 'react';

import storage, { StorageState } from '../utils/storage';

export function useStorage<K extends keyof StorageState>(
  key: K
): [StorageState[K], (newValue: StorageState[K]) => void] {
  const setting = storage.getKey(key);
  const [value, setState] = useState(setting);

  const setWrappedState = useCallback(
    (newValue: StorageState[K]) => {
      const currentSetting = storage.getKey(key);
      const currentSettingObj =
        typeof currentSetting === 'object' ? currentSetting : {};

      const data =
        typeof newValue === 'object'
          ? { [key]: { ...currentSettingObj, ...(newValue as object) } }
          : { [key]: newValue };

      const updated = storage.set(data)[key];
      setState(updated);
    },
    [key]
  );

  return [value, setWrappedState];
}
