import Link from 'next/link';

/* ── Animated background grid ── */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,245,255,0.12) 0%, transparent 60%)',
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: 'linear-gradient(to top, #0A0A0F 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="card-hover group cursor-default">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-neon transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

/* ── Stat item ── */
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-neon">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: '🗺️',
    title: 'Interactive Roadmap',
    description:
      'Visualise every step of your business setup journey on an interactive node map. Locked, unlocked, and completed — always know where you are.',
  },
  {
    icon: '⚖️',
    title: 'Compliance Guidance',
    description:
      'Navigate ASIC, ATO, SafeWork, and licensing requirements with clear, structured steps — no more missing critical obligations.',
  },
  {
    icon: '🛠️',
    title: 'Equipment & Tools',
    description:
      'Get curated recommendations for the right equipment, software, and services specific to your industry and business type.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description:
      'Track your completion percentage in real time. Upload documents, add notes, and mark steps done — all in one place.',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    description:
      'Your documents and business data are private by default. Role-based access control keeps admin and user experiences separate.',
  },
  {
    icon: '🚀',
    title: 'Launch Ready',
    description:
      'Designed so you or your team can go from idea to operational readiness without getting lost in endless government portals.',
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GridBackground />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Build<span className="text-neon">Path</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm py-2 px-4">
            Sign in
          </Link>
          <Link href="/login" className="btn-primary text-sm py-2 px-4">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-28 text-center md:pt-28 md:pb-40">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/5 px-4 py-1.5 text-xs font-medium text-[#00F5FF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
          MVP — Cabinet Manufacturing · NSW
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
          Your business setup{' '}
          <span className="text-neon">roadmap,</span>
          <br />
          <span className="text-neon-purple">step by step.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
          BuildPath is a gamified, interactive platform that guides Australian entrepreneurs through
          compliance, operations, equipment selection, and business readiness — all in one place.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login" id="hero-cta-primary" className="btn-primary px-8 py-3.5 text-base">
            Start My Roadmap →
          </Link>
          <a
            href="#features"
            id="hero-cta-secondary"
            className="btn-secondary px-8 py-3.5 text-base"
          >
            See how it works
          </a>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-20 grid max-w-lg grid-cols-3 gap-8 border-t border-white/5 pt-10">
          <Stat value="7" label="Stages" />
          <Stat value="40+" label="Guided steps" />
          <Stat value="100%" label="DB-driven" />
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-28"
      >
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Everything you need to get started
          </h2>
          <p className="text-slate-400">
            A structured journey designed for trade-based entrepreneurs in Australia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-28">
        <div
          className="rounded-3xl border border-[#00F5FF]/20 p-10 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,245,255,0.05) 0%, rgba(191,90,242,0.05) 100%)',
          }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to build your business?
          </h2>
          <p className="mb-8 text-slate-400">
            Join BuildPath and get a clear, personalised roadmap in minutes.
          </p>
          <Link href="/login" id="cta-banner-btn" className="btn-primary px-10 py-3.5 text-base">
            Start for free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        <p>© 2026 BuildPath. Built for Australian entrepreneurs.</p>
      </footer>
    </main>
  );
}
