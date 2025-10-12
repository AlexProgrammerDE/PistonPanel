import type {
  KubernetesListObject,
  KubernetesObject,
} from "@kubernetes/client-node";
import type { Organization } from "better-auth/plugins";
import * as k from "cdk8s";
import * as kplus from "cdk8s-plus-32";
import { eq } from "drizzle-orm";
import { k8sAppNamespace } from "~/config";
import { db } from "~/db";
import { orgServersTable } from "~/db/schema";

export type ComponentType = "server" | "database";

export function baseGlobalSelectorLabels(): Record<string, string> {
  return {
    "app.kubernetes.io/managed-by": "pistonpanel",
  };
}

export function baseServerSelectorLabels(
  resourceId: string,
): Record<string, string> {
  return {
    ...baseGlobalSelectorLabels(),
    "app.kubernetes.io/instance": resourceId,
    "pistonpanel.com/server-id": resourceId,
  };
}

export function baseOrgSelectorLabels(orgId: string): Record<string, string> {
  return {
    ...baseGlobalSelectorLabels(),
    "pistonpanel.com/tenant": orgId,
  };
}

export function baseLabels(
  orgId: string,
  resourceId: string,
  component: ComponentType,
): Record<string, string> {
  return {
    ...baseServerSelectorLabels(resourceId),
    ...baseOrgSelectorLabels(orgId),
    // 'app.kubernetes.io/app': '',
    "app.kubernetes.io/component": component,
  };
}

export async function sync(org: Organization) {
  const k8sApp = new k.App();
  const servers = await db
    .select()
    .from(orgServersTable)
    .where(eq(orgServersTable.orgId, org.id))
    .execute();
  for (const server of servers) {
    const serverChart = new k.Chart(k8sApp, `server-${server.id}`, {
      namespace: k8sAppNamespace,
      labels: {
        ...baseLabels(org.id, String(server.id), "server"),
      },
      disableResourceNameHashes: true,
    });

    const serverStatefulSet = new kplus.StatefulSet(
      serverChart,
      `server-${server.id}`,
      {
        service: new kplus.Service(serverChart, `server-${server.id}`, {
          type: kplus.ServiceType.CLUSTER_IP,
          ports: [
            {
              port: 80,
              targetPort: 80,
            },
          ],
        }),
        replicas: 1,
        containers: [
          {
            name: "main",
            image: "nginx",
          },
        ],
      },
    );

    new kplus.NetworkPolicy(serverChart, `server-${server.id}`, {
      selector: serverStatefulSet,
      ingress: {
        default: kplus.NetworkPolicyTrafficDefault.DENY,
        rules: [
          {
            peer: kplus.Pods.select(serverChart, "org-pods", {
              namespaces: kplus.Namespaces.select(
                serverChart,
                "app-namespace",
                {
                  names: [k8sAppNamespace],
                },
              ),
              labels: {
                ...baseOrgSelectorLabels(org.id),
              },
            }),
          },
        ],
      },
      egress: {
        default: kplus.NetworkPolicyTrafficDefault.DENY,
        rules: [
          // Allow talking to DNS
          {
            peer: kplus.Pods.select(serverChart, "kube-dns-pods", {
              namespaces: kplus.Namespaces.select(serverChart, "kube-system", {
                labels: {
                  "kubernetes.io/metadata.name": "kube-system",
                },
              }),
              labels: {
                "k8s-app": "kube-dns",
              },
            }),
            ports: [
              kplus.NetworkPolicyPort.udp(53),
              kplus.NetworkPolicyPort.tcp(53),
            ],
          },
          // Allow talking to the internet via ipv4
          {
            peer: kplus.NetworkPolicyIpBlock.anyIpv4(
              serverChart,
              "internet-ipv4",
            ),
          },
          // Allow talking to the internet via ipv6
          {
            peer: kplus.NetworkPolicyIpBlock.anyIpv6(
              serverChart,
              "internet-ipv6",
            ),
          },
        ],
      },
    });
  }

  const synthedObjects = k8sApp.charts.flatMap(
    (chart) => k.App._synthChart(chart) as KubernetesObject[],
  );
  console.debug(synthedObjects);
  await apply<KubernetesListObject<KubernetesObject>>({
    apiVersion: "v1",
    kind: "List",
    items: synthedObjects,
  });
}

async function apply<T extends KubernetesObject>(_resource: T) {
  // await k8sObjectApi.patch(
  //   resource,
  //   undefined,
  //   undefined,
  //   'pistonpanel',
  //   true,
  //   'application/apply-patch+yaml',
  // );
}
