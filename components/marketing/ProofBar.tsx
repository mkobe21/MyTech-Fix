const STATS = [
  { value: '2,400+', label: 'Issues resolved' },
  { value: '4.9★', label: 'Average rating' },
  { value: '<3 min', label: 'Avg. time to fix' },
  { value: '$0', label: 'To get started' },
];

export default function ProofBar() {
  return (
    <div className="border-y border-white/[0.07] bg-gray-900/60 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap justify-center sm:justify-between gap-y-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="text-center min-w-[100px]">
                <div className="font-sora text-2xl font-bold text-slate-50">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-0.5">{stat.label}</div>
              </div>
              {i < STATS.length - 1 && (
                <div className="hidden sm:block h-10 w-px bg-white/[0.07]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
