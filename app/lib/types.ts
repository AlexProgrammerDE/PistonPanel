import { InstanceState } from '@/generated/pistonpanel/instance';
import { i18n } from 'i18next';

export function getEnumKeyByValue<E extends object>(
  enumObj: E,
  value: E[keyof E],
): keyof E {
  return Object.entries(enumObj).find(([, v]) => v === value)?.[0] as keyof E;
}

export function getEnumEntries<E extends object>(
  enumObj: E,
): {
  key: keyof E;
  value: E[keyof E];
}[] {
  return Object.entries(enumObj)
    .filter(([key]) => isNaN(parseInt(key)))
    .map(([key, value]) => ({
      key: key as keyof E,
      value: value as E[keyof E],
    }));
}

export function translateInstanceState(
  i18n: i18n,
  state: InstanceState,
): string {
  return i18n.t(
    `instanceState.${getEnumKeyByValue(InstanceState, state).toLowerCase()}`,
  );
}
