interface TLDRBoxProps {
  points: string[];
  label?: string;
}

export default function TLDRBox({ points, label = 'Quick Answer' }: TLDRBoxProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-8">
      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">{label}</div>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
            <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
