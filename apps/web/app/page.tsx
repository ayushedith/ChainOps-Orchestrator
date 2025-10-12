import Link from 'next/link';

const heroCards = [
  {
    title: 'Deploy Contracts Safely',
    body: 'Trigger Foundry or Hardhat pipelines, run forks, and ship with confidence in minutes.',
    href: '#deployments'
  },
  {
    title: 'Observe in Real Time',
    body: 'Track queue depth, validator health, and explorer confirmations without leaving Discord.',
    href: '#observability'
  },
  {
    title: 'Approve with Wallets',
    body: 'Collect multisig signatures, enforce policy checks, and broadcast transactions programmatically.',
    href: '#approvals'
  }
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          ChainOps Orchestrator
        </h1>
        <p className="text-lg text-slate-300 sm:text-xl">
          Deploy smart contracts, monitor validators, and align teams with instant feedback loops in
          Discord and on the dashboard.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow hover:bg-emerald-400"
          >
            Launch Console
          </Link>
          <Link
            href="#"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            View Docs
          </Link>
        </div>
      </section>
      <section className="grid gap-4" id="capabilities">
        <h2 className="text-2xl font-medium text-white">Capabilities</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {heroCards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{card.body}</p>
              <Link
                className="mt-4 inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
                href={card.href}
              >
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
