import { getEnvVar } from "./env";

export const siteName = getEnvVar("SITE_NAME", "PistonPanel");
export const siteBaseUrl = getEnvVar("BASE_URL", "http://localhost:3000");
export const k8sAppNamespace = getEnvVar("K8S_NAMESPACE");
