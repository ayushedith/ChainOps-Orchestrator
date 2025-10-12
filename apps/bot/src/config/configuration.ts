import { ConfigFactory } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  GITHUB_TOKEN: z.string().optional(),
  REDIS_URL: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  ANVIL_RPC_URL: z.string().min(1)
});

const configuration: ConfigFactory = () => {
  const parsed = envSchema.parse(process.env);
  return {
    env: parsed.NODE_ENV,
    http: {
      port: parsed.PORT
    },
    discord: {
      token: parsed.DISCORD_BOT_TOKEN,
      clientId: parsed.DISCORD_CLIENT_ID
    },
    redis: {
      url: parsed.REDIS_URL
    },
    database: {
      url: parsed.POSTGRES_URL
    },
    chain: {
      rpcUrl: parsed.ANVIL_RPC_URL
    },
    github: {
      token: parsed.GITHUB_TOKEN
    }
  };
};

export default configuration;
