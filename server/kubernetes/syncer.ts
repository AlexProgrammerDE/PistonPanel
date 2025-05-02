import { Organization } from 'better-auth/plugins';
import { k8sObjectApi } from '~/kubernetes/client';
import {
  KubernetesObject,
  V1NetworkPolicyList,
  V1StatefulSet,
} from '@kubernetes/client-node';
import { db } from '~/db';
import { orgServersTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/models/V1ObjectMeta';
import { k8sNamespace } from '~/config';

export type ComponentType = 'server' | 'database';

export function baseSelectorLabels(resourceId: string): V1ObjectMeta['labels'] {
  return {
    'app.kubernetes.io/instance': resourceId,
    'pistonpanel.com/server-id': resourceId,
    'app.kubernetes.io/managed-by': 'pistonpanel',
  };
}

export function baseLabels(
  orgId: string,
  resourceId: string,
  component: ComponentType,
): V1ObjectMeta['labels'] {
  return {
    ...baseSelectorLabels(resourceId),
    'pistonpanel.com/tenant': orgId,
    // 'app.kubernetes.io/app': '',
    'app.kubernetes.io/component': component,
  };
}

export async function sync(org: Organization) {
  const servers = await db
    .select()
    .from(orgServersTable)
    .where(eq(orgServersTable.orgId, org.id))
    .execute();
  for (const server of servers) {
    await createOrReplace<V1NetworkPolicyList>({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicyList',
      items: [
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'NetworkPolicy',
          metadata: {
            name: `server-${server.id}-deny-all`,
            namespace: k8sNamespace,
            labels: {
              ...baseLabels(org.id, String(server.id), 'server'),
            },
          },
          spec: {
            podSelector: {
              matchLabels: {
                ...baseSelectorLabels(String(server.id)),
              },
            },
            policyTypes: ['Ingress', 'Egress'],
            ingress: [],
            egress: [],
          },
        },
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'NetworkPolicy',
          metadata: {
            name: `server-${server.id}-allow-dns-egress`,
            namespace: k8sNamespace,
            labels: {
              ...baseLabels(org.id, String(server.id), 'server'),
            },
          },
          spec: {
            podSelector: {
              matchLabels: {
                ...baseSelectorLabels(String(server.id)),
              },
            },
            policyTypes: ['Egress'],
            egress: [
              {
                to: [
                  {
                    namespaceSelector: {
                      matchLabels: { 'k8s-app': 'kube-dns' },
                    },
                    podSelector: { matchLabels: { 'k8s-app': 'kube-dns' } },
                  },
                ],
                ports: [
                  { protocol: 'UDP', port: 53 },
                  { protocol: 'TCP', port: 53 },
                ],
              },
            ],
          },
        },
        {
          apiVersion: 'networking.k8s.io/v1',
          kind: 'NetworkPolicy',
          metadata: {
            name: `server-${server.id}-allow-pod-egress`,
            namespace: k8sNamespace,
            labels: {
              ...baseLabels(org.id, String(server.id), 'server'),
            },
          },
          spec: {
            podSelector: {
              matchLabels: {
                ...baseSelectorLabels(String(server.id)),
              },
            },
            policyTypes: ['Egress'],
            egress: [
              {
                to: [
                  {
                    namespaceSelector: {},
                    podSelector: {},
                  },
                ],
              },
            ],
          },
        },
      ],
    });
    await createOrReplace<V1StatefulSet>({
      apiVersion: 'apps/v1',
      kind: 'StatefulSet',
      metadata: {
        name: `server-${server.id}-statefulset`,
        namespace: k8sNamespace,
        labels: {
          ...baseLabels(org.id, String(server.id), 'server'),
        },
      },
      spec: {
        serviceName: `server-${server.id}`,
        replicas: 1,
        selector: {
          matchLabels: {
            ...baseSelectorLabels(String(server.id)),
          },
        },
        template: {
          metadata: {
            namespace: k8sNamespace,
            labels: {
              ...baseLabels(org.id, String(server.id), 'server'),
            },
          },
          spec: {
            containers: [
              {
                name: 'my-container',
                image: 'nginx',
              },
            ],
          },
        },
      },
    });
  }
}

async function createOrReplace<T extends KubernetesObject>(resource: T) {
  try {
    await k8sObjectApi.create(resource);
    console.log(`Created ${resource.kind} ${resource.metadata?.name}`);
  } catch (e: unknown) {
    console.log(e);
    const error = e as { body: { reason: string } };
    if (error.body && error.body.reason === 'AlreadyExists') {
      await k8sObjectApi.replace(resource);
      console.log(`Replaced ${resource.kind} ${resource.metadata?.name}`);
    } else {
      throw e;
    }
  }
}
