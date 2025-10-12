import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
export const k8sObjectApi = kc.makeApiClient(k8s.KubernetesObjectApi);
export const k8sLogApi = new k8s.Log(kc);
