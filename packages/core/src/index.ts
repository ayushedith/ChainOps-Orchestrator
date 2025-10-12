import { z } from 'zod';

export const sharedEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  ANVIL_RPC_URL: z.string().url(),
  GITHUB_TOKEN: z.string().optional()
});

export type SharedEnv = z.infer<typeof sharedEnvSchema>;

export function loadSharedEnv(env: NodeJS.ProcessEnv): SharedEnv {
  return sharedEnvSchema.parse(env);
}
