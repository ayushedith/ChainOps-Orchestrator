import Link from 'next/link';

const capabilityCards = [
  {
    title: 'Deploy Contracts Safely',
    body: 'Trigger Foundry or Hardhat pipelines, run forks, and ship with confidence in minutes.'
  },
  {
    title: 'Observe in Real Time',
    body: 'Track queue depth, validator health, and explorer confirmations without leaving Discord.'
  },
  {
    title: 'Approve with Wallets',
    body: 'Collect multisig signatures, enforce policy checks, and broadcast transactions programmatically.'
  },
  {
    title: 'Automate Incident Response',
    body: 'Escalate failures, open tickets, and coordinate validators with one slash command.'
  }
];

const timeline = [
  {
    label: '01. Plan',
    description: 'Sync Discord runbooks to GitHub issues, assign owners, and lock approvals.'
  },
  {
    label: '02. Ship',
    description: 'Fire deterministic deployments across chains, capturing explorer receipts automatically.'
  },
  {
    label: '03. Observe',
    description: 'Stream validator metrics, queue depth, and contract events into dashboards and channels.'
  },
  {
    label: '04. Learn',
    description: 'Archive every interaction into a searchable postmortem timeline and surface insights.'
  }
];

const integrations = [
  'GitHub Actions',
  'Foundry / Anvil',
  'Safe / Multisig',
  'PagerDuty',
  'Grafana',
  'Slack Bridge'
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-20 px-6 py-20 sm:px-10">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              ChainOps Orchestrator
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Ship smart-contract DevOps at the speed of Discord.
            </h1>
            <p className="text-pretty text-base text-slate-300 sm:text-lg">
              Align on-chain releases, infrastructure automation, and validator health in one command surface. The orchestrator keeps your guild, pipelines, and dashboards perfectly in sync.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Launch Console
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-500/60 hover:text-emerald-300"
              >
                View Docs
              </Link>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Deployments orchestrated</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">24k+</dd>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Mean time to ship</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">4.5 min</dd>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Supported chains</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">12</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/70 p-6 shadow-[0_0_120px_rgba(16,185,129,0.25)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Execution Graph</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              {timeline.map((step) => (
                <div key={step.label} className="rounded-lg border border-slate-800/80 bg-slate-900/80 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10" id="capabilities">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">Capabilities tuned for Web3 DevOps</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Each module can run standalone or compose into end-to-end playbooks. Slash commands map directly to your pipelines, observability stack, and multisig policies.
              </p>
            </div>
            <Link href="#" className="inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              Explore automation blueprints →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map((card) => (
              <article
                key={card.title}
                className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm transition hover:border-emerald-400/60 hover:bg-slate-900/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-lg text-emerald-300">
                  ⚡
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{card.body}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-300 opacity-0 transition group-hover:opacity-100">
                  See playbook →
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-8 shadow-lg sm:grid-cols-[1.2fr_1fr] sm:items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Plug into the tooling you already trust</h2>
            <p className="text-sm text-slate-300">
              Hook directly into CI/CD, observability, incident tooling, and wallet infrastructure. ChainOps orchestrates your full DevSecOps loop without forcing another control plane.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-slate-200 sm:grid-cols-3">
            {integrations.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-center shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
