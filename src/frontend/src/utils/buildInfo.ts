// Build information utility - single source of truth for version/build string
export function getBuildVersion(): string {
  // Try to read from build-time environment variables
  const buildVersion = import.meta.env.VITE_BUILD_VERSION;
  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;
  const gitCommit = import.meta.env.VITE_GIT_COMMIT;

  // Construct version string with available information
  if (buildVersion) {
    return buildVersion;
  }

  if (gitCommit) {
    return `v${gitCommit.substring(0, 7)}`;
  }

  if (buildTimestamp) {
    const date = new Date(buildTimestamp);
    return `build-${date.toISOString().split('T')[0]}`;
  }

  // Fallback to a generic version
  return 'v1.0.0';
}
