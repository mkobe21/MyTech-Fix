import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

interface MidCTAProps {
  heading: string;
  body: string;
  chatLink: string;
}

export default function MidCTA({ heading, body, chatLink }: MidCTAProps) {
  return (
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center my-10">
      <div className="flex-1">
        <h3 className="font-semibold text-slate-100 mb-1">{heading}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
      </div>
      <Link
        href={chatLink}
        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Get AI Help
      </Link>
    </div>
  );
}
