import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from './trpc';
import { siteBaseUrl } from '~/config';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'PistonPanel OpenAPI',
  version: '1.0.0',
  baseUrl: siteBaseUrl + '/api/trpc',
});
