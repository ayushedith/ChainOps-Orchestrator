# Leventeen3 Monorepo

High-velocity ChainOps Orchestrator featuring a Discord automation bot and web dashboard.

## Structure

- `apps/bot` – NestJS + discord.js orchestrator for smart-contract DevOps.
- `apps/web` – Next.js dashboard for deployments, telemetry, and approvals.
- `packages/core` – Shared TypeScript utilities, config loaders, and constants.
- `packages/infra` – Infrastructure-as-code building blocks and deployment scripts.

## Getting Started

1. Install pnpm 9+: `Corepack enable` then `corepack prepare pnpm@9.1.0 --activate`.
2. Install deps: `pnpm install`.
3. Start redis/postgres tooling with `docker compose up -d` (coming soon).
4. Run bot and web: `pnpm dev` or targeted `pnpm --filter bot dev` / `pnpm --filter web dev`.

## Environment

Copy `.env.example` to `.env.local` in each app and fill secrets. Central secrets managed via Doppler or Vault is recommended.
