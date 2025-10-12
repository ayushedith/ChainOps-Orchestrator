import { sharedEnvSchema } from '@leventeen3/core';
import { z } from 'zod';

const webEnvSchema = sharedEnvSchema.extend({
  NEXT_PUBLIC_DASHBOARD_URL: z.string().url().default('http://localhost:3000')
});

export const env = webEnvSchema.parse(process.env);
