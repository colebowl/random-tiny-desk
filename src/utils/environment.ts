type EnvVars = {
  YOUTUBE_API_KEY: string;
  PLAYLIST_ID: string;
};

export const getEnvironmentVariable = <K extends keyof EnvVars>(
  name: K,
  fallback?: string
): EnvVars[K] => {
  const key = name as string;

  const value = Deno.env.get(key) || fallback;

  if (!value) {
    throw new Error(`Environment variable with name [${key}] missing`);
  }

  return value;
};
