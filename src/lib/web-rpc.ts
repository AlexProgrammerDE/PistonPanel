import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

export const createTransport = () => {
  return new GrpcWebFetchTransport({
    baseUrl: '/grpc',
    meta: {
      Authorization: `Beare abc}`,
    },
  });
};
