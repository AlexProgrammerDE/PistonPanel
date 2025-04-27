import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  GlobalPermission,
  InstancePermission,
} from '@/generated/pistonpanel/common';
import { ClientDataResponse } from '@/generated/pistonpanel/client';
import {
  InstanceInfoResponse,
  InstanceListResponse,
  InstanceListResponse_Instance,
} from '@/generated/pistonpanel/instance';
import { sha256 } from 'js-sha256';
import * as Flags from 'country-flag-icons/react/3x2';
import { type FlagComponent } from 'country-flag-icons/react/1x1';
import { ReactNode } from 'react';
import { InstanceInfoQueryData } from '@/lib/types';
import { InstanceServiceClient } from '@/generated/pistonpanel/instance.client';
import { RpcTransport } from '@protobuf-ts/runtime-rpc';
import { QueryClient, QueryKey } from '@tanstack/react-query';
import { Timestamp } from '@/generated/google/protobuf/timestamp';
import { ClientServiceClient } from '@/generated/pistonpanel/client.client';

export const ROOT_USER_ID = '00000000-0000-0000-0000-000000000000';
const LOCAL_STORAGE_TERMINAL_THEME_KEY = 'terminal-theme';

const emojiMap = APP_LOCALES.split(',').reduce<Record<string, FlagComponent>>(
  (acc, locale) => {
    const countryCode = locale.split('-')[1];
    if (!countryCode) return acc;

    acc[countryCode] = Flags[countryCode as keyof typeof Flags];
    return acc;
  },
  {},
);

export function setTerminalTheme(theme: string) {
  localStorage.setItem(LOCAL_STORAGE_TERMINAL_THEME_KEY, theme);
}

export function getTerminalTheme() {
  return localStorage.getItem(LOCAL_STORAGE_TERMINAL_THEME_KEY) ?? 'mocha';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cancellablePromiseDefault<T extends () => void>(
  promise: Promise<T>,
): () => void {
  return cancellablePromise(promise, (run) => run());
}

export function cancellablePromise<T>(
  promise: Promise<T>,
  cancel: (value: T) => void,
): () => void {
  let cancelled = false;
  let resolvedValue: T | null = null;
  void promise.then((value) => {
    if (cancelled) {
      cancel(value);
    } else {
      resolvedValue = value;
    }
  });

  return () => {
    cancelled = true;
    if (resolvedValue != null) {
      cancel(resolvedValue);
    }
  };
}

export function hasGlobalPermission(
  clientData: ClientDataResponse,
  permission: GlobalPermission,
) {
  return clientData.serverPermissions
    .filter((p) => p.granted)
    .map((p) => p.globalPermission)
    .includes(permission);
}

export function hasInstancePermission(
  instanceInfo: InstanceInfoResponse | InstanceListResponse_Instance,
  permission: InstancePermission,
) {
  return instanceInfo.instancePermissions
    .filter((p) => p.granted)
    .map((p) => p.instancePermission)
    .includes(permission);
}

export function getGravatarUrl(email: string) {
  return `https://www.gravatar.com/avatar/${sha256(email)}?d=404`;
}

export function data2blob(data: string) {
  const bytes = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    bytes[i] = data.charCodeAt(i);
  }

  return new Blob([new Uint8Array(bytes)]);
}

export function languageEmoji(locale: string): ReactNode {
  if (locale === 'lol-US') {
    return '🐱';
  }

  const countryCode = locale.split('-')[1];
  if (!countryCode) return '';

  const Flag = emojiMap[countryCode];
  if (!Flag) return '';

  return <Flag className="mx-1 size-4 align-middle" />;
}

export function getLanguageName(languageCode: string, displayLanguage: string) {
  if (languageCode === 'lol-US') {
    return 'LOLCAT';
  }

  const displayNames = new Intl.DisplayNames([displayLanguage], {
    type: 'language',
  });
  return displayNames.of(languageCode) ?? languageCode;
}

export async function setInstanceIcon(
  icon: string,
  instanceInfo: {
    id: string;
  },
  transport: RpcTransport | null,
  queryClient: QueryClient,
  instanceInfoQueryKey: QueryKey,
  instanceListQueryKey: QueryKey,
) {
  if (transport === null) {
    return;
  }

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: instanceInfoQueryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: instanceListQueryKey,
    }),
  ]);
  queryClient.setQueryData<InstanceInfoQueryData>(
    instanceInfoQueryKey,
    (old) => {
      if (old === undefined) {
        return;
      }

      return {
        ...old,
        icon: icon,
      };
    },
  );
  queryClient.setQueryData<InstanceListResponse>(
    instanceListQueryKey,
    (old) => {
      if (old === undefined) {
        return;
      }

      return {
        instances: old.instances.map((item) => {
          if (item.id === instanceInfo.id) {
            return {
              ...item,
              icon: icon,
            };
          }

          return item;
        }),
      };
    },
  );

  const instanceService = new InstanceServiceClient(transport);
  await instanceService.updateInstanceMeta({
    id: instanceInfo.id,
    meta: {
      oneofKind: 'icon',
      icon: icon,
    },
  });
}

export async function setInstanceFriendlyName(
  friendlyName: string,
  instanceInfo: {
    id: string;
  },
  transport: RpcTransport | null,
  queryClient: QueryClient,
  instanceInfoQueryKey: QueryKey,
  instanceListQueryKey: QueryKey,
) {
  if (transport === null) {
    return;
  }

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: instanceInfoQueryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: instanceListQueryKey,
    }),
  ]);
  queryClient.setQueryData<InstanceInfoQueryData>(
    instanceInfoQueryKey,
    (old) => {
      if (old === undefined) {
        return;
      }

      return {
        ...old,
        friendlyName: friendlyName,
      };
    },
  );
  queryClient.setQueryData<InstanceListResponse>(
    instanceListQueryKey,
    (old) => {
      if (old === undefined) {
        return;
      }

      return {
        instances: old.instances.map((item) => {
          if (item.id === instanceInfo.id) {
            return {
              ...item,
              friendlyName: friendlyName,
            };
          }

          return item;
        }),
      };
    },
  );

  const instanceService = new InstanceServiceClient(transport);
  await instanceService.updateInstanceMeta({
    id: instanceInfo.id,
    meta: {
      oneofKind: 'friendlyName',
      friendlyName: friendlyName,
    },
  });
}

export async function setSelfUsername(
  username: string,
  transport: RpcTransport | null,
  queryClient: QueryClient,
  clientDataQueryKey: QueryKey,
) {
  if (transport === null) {
    return;
  }

  await queryClient.cancelQueries({
    queryKey: clientDataQueryKey,
  });
  queryClient.setQueryData<ClientDataResponse>(clientDataQueryKey, (old) => {
    if (old === undefined) {
      return;
    }

    return {
      ...old,
      username: username,
    };
  });

  const clientService = new ClientServiceClient(transport);
  await clientService.updateSelfUsername({
    username: username,
  });
}

export async function setSelfEmail(
  email: string,
  transport: RpcTransport | null,
  queryClient: QueryClient,
  clientDataQueryKey: QueryKey,
) {
  if (transport === null) {
    return;
  }

  await queryClient.cancelQueries({
    queryKey: clientDataQueryKey,
  });
  queryClient.setQueryData<ClientDataResponse>(clientDataQueryKey, (old) => {
    if (old === undefined) {
      return;
    }

    return {
      ...old,
      email: email,
    };
  });

  const clientService = new ClientServiceClient(transport);
  await clientService.updateSelfEmail({
    email: email,
  });
}

export function timestampToDate(timestamp: Timestamp): Date {
  return new Date(
    parseInt(timestamp.seconds) * 1000 +
      Math.floor((timestamp.nanos || 0) / 1e6),
  );
}

export function runAsync(fn: () => Promise<void>) {
  void fn().catch(console.error);
}

export function formatIconName(text: string): string {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
