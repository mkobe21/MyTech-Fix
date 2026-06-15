interface StepItemProps {
  step: number;
  title: string;
  description: string;
  tip?: string;
}

export default function StepItem({ step, title, description, tip }: StepItemProps) {
  return (
    <div className="flex gap-5 pb-7 last:pb-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm mt-0.5">
        {step}
      </div>
      <div className="flex-1 border-b border-white/[0.06] pb-7 last:border-0 last:pb-0">
        <h3 className="font-semibold text-slate-100 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        {tip && (
          <div className="mt-3 rounded-xl bg-blue-500/5 border border-blue-500/10 px-4 py-2.5 text-xs text-blue-300 leading-relaxed">
            <span className="font-semibold text-blue-400">Pro tip: </span>{tip}
          </div>
        )}
      </div>
    </div>
  );
}
