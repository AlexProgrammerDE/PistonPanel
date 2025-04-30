import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from './trpc';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'PistonPanel OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000',
});
