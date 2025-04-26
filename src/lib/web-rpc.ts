import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import i18n from '@/lib/i18n';
import { AuthType, createClient, WebDAVClient } from 'webdav';
import { ClientDataResponse } from '@/generated/pistonpanel/client';

const LOCAL_STORAGE_SERVER_TOKEN_KEY = 'server-token';
const LOCAL_STORAGE_SERVER_WEBDAV_TOKEN_KEY = 'server-webdav-token';
const LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY =
  'server-impersonation-token';

export const isAuthenticated = () => {
  return localStorage.getItem(LOCAL_STORAGE_SERVER_TOKEN_KEY) !== null;
};

export const setAuthentication = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_SERVER_TOKEN_KEY, token);
};

export const getOrGenerateWebDAVToken = (generator: () => string): string => {
  let token = localStorage.getItem(LOCAL_STORAGE_SERVER_WEBDAV_TOKEN_KEY);
  if (!token) {
    token = generator();
    localStorage.setItem(LOCAL_STORAGE_SERVER_WEBDAV_TOKEN_KEY, token);
  }
  return token;
};

export function createWebDAVClient(
  clientInfo: ClientDataResponse,
  generator: () => string,
): WebDAVClient {
  const token = getOrGenerateWebDAVToken(generator);
  return createClient(clientInfo.serverInfo!.publicWebdavAddress, {
    authType: AuthType.Password,
    username: 'ignored',
    password: token,
  });
}

export const logOut = () => {
  localStorage.removeItem(LOCAL_STORAGE_SERVER_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SERVER_WEBDAV_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY);
};

export const startImpersonation = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY, token);
};

export const stopImpersonation = () => {
  localStorage.removeItem(LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY);
};

export const isImpersonating = () => {
  return (
    localStorage.getItem(LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY) !== null
  );
};

export const createTransport = () => {
  let token = localStorage.getItem(LOCAL_STORAGE_SERVER_TOKEN_KEY);

  if (!token) {
    throw new Error(i18n.t('common:error.noAddressOrToken'));
  }

  const impersonationToken = localStorage.getItem(
    LOCAL_STORAGE_SERVER_IMPERSONATION_TOKEN_KEY,
  );
  if (impersonationToken !== null) {
    token = impersonationToken;
  }

  return new GrpcWebFetchTransport({
    baseUrl: '/grpc',
    meta: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAddressOnlyTransport = () => {
  return new GrpcWebFetchTransport({
    baseUrl: '/grpc',
  });
};
