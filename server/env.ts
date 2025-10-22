export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`Environment variable ${name} is not defined`);
  }

  return value;
}
